import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors';
import { addItem, getAllItems, updateItem, deleteItem } from './itemController'
import { checkIfAuthenticated } from './middleware/auth'
const app = express()

app.use(cors({ origin: true }));
// app.use(checkIfAuthenticated)

app.get('/', (req, res) => res.status(200).send('Hey there!'))

// endpoints for item
app.post('/item', checkIfAuthenticated, addItem)
app.get('/item', checkIfAuthenticated, getAllItems)
app.patch('/item/:id', checkIfAuthenticated, updateItem)
app.delete('/item/:id', checkIfAuthenticated, deleteItem)

app.get('*', (req, res) => res.status(200).send('invalid request'))

exports.app = functions.https.onRequest(app)
