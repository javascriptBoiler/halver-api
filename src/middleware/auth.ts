import { NextFunction, Request, Response } from 'express';
import * as firebase from 'firebase-admin';


const getAuthToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      // @ts-ignore
      req.authToken = req.headers.authorization.split(' ')[1];
    } else {
      // @ts-ignore
      req.authToken = null;
    }
    next();
  };

export const checkIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    getAuthToken(req, res, async () => {
      try {
        // @ts-ignore
        const { authToken } = req;
        const userInfo = await firebase.auth().verifyIdToken(authToken);
        // @ts-ignore
        req.authId = userInfo.uid;
        return next();
      } catch (e) {
        return res.status(401).send({ error: 'You are not authorized to make this request' });
      }
    });
  };

  export const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
    getAuthToken(req, res, async () => {
      try {
        const authToken = req;
        const userInfo = await firebase.auth().verifyIdToken(`${authToken}`);
        if (userInfo.admin === true) {
          // @ts-ignore
          req.authId = userInfo.uid;
          return next();
        }
      } catch (e) {
        return res.status(401).send({ error: 'You are not authorized to make this request' });
      }
    });
  };