import { Response } from "express"
import { db, admin } from './config/firebase'

const COLLECTION_NAME = 'item'

type Location = {
  lat: string,
  lng: string
}

type ItemType = {
  name: string,
  description: string,
  sender: string,
  receiver: string,
  location: Location,
  images: [string],
  isVisible: Boolean,
  isDeleted: Boolean,
  isFree: Boolean,
  category: 'food' | 'non-food'
}

type Request = {
  body: ItemType,
  params: { id: string },
  authId?: string
}

const addItem = async (req: Request, res: Response) => {
  const { name, description, location, images, isVisible = true, isDeleted=false , isFree=true, category = 'food' } = req.body
  const sender = req.authId;
  try {
    const item = db.collection(COLLECTION_NAME).doc()
    const itemObject = {
      id: item.id, 
      sender,name, 
      description, location, 
      images, isVisible, isDeleted,
      isFree, category,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      updateAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    await item.set(itemObject)

    res.status(200).send({
      status: 'success',
      message: 'item added successfully',
      data: itemObject
    })
  } catch(error) {
    // @ts-ignore
      res.status(500).json(error.message)
  }
}

const getAllItems = async (req: Request, res: Response) => {
  try {
    const allItems: ItemType[] = []
    const querySnapshot = await db.collection(COLLECTION_NAME).get()
    querySnapshot.forEach((doc: any) => allItems.push(doc.data()))
    return res.status(200).json(allItems)
  } catch(error) { 
    // @ts-ignore
    return res.status(500).json(error.message) 
  }
}

const updateItem = async (req: Request, res: Response) => {
  const { body: { 
    name, description, receiver, 
    location, images, isVisible = true, 
    isDeleted=false , isFree=true, category = 'food' 
  }, params: { id } } = req

  try {
    const item = db.collection(COLLECTION_NAME).doc(id)
    const currentData = (await item.get()).data() || {}

    const itemObject = {
      name: name || currentData.name,
      description: description || currentData.description,
      receiver: receiver || currentData.receiver,
      location: location || currentData.location, 
      images: images || currentData.images, 
      isVisible: isVisible || currentData.isVisible,
      isDeleted: isDeleted || currentData.isDeleted,
      isFree: isFree || currentData.isFree,
      category: category || currentData.category,
      updateAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    await item.set(itemObject).catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'item updated successfully',
      data: itemObject
    })
  }
  catch(error) { 
    // @ts-ignore
    return res.status(500).json(error.message) 
  }
}

const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const item = db.collection(COLLECTION_NAME).doc(id)

    await item.delete().catch(error => {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    })

    return res.status(200).json({
      status: 'success',
      message: 'item deleted successfully',
    })
  }
  catch(error) { 
    // @ts-ignore
    return res.status(500).json(error.message) 
  }
}

export { addItem, getAllItems, updateItem, deleteItem }
