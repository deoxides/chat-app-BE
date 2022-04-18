import jwt, { JwtPayload, verify } from 'jsonwebtoken';
import firebaseApp from '../firebase/index';

import { UserSmall } from '../models/user';

export const createToken = (id:string = ''):Promise<string | undefined> => {
    return new Promise((resolve,reject) =>{
        const payload = {id};
        jwt.sign(payload,process.env.JWT_KEY!,{
            expiresIn:'4h'
        },(err,token) =>{
            if(err){
                console.log(err)
                reject('The token was not created')
            }else{
                resolve(token)
            }
        })
    })
}

export const getUserInfo = (token:string): Promise<UserSmall| null> => {
    return new Promise((resolve) => {
        firebaseApp.Auth.verifyIdToken(token)
            .then((idToken) => {
                firebaseApp.Auth.getUser(idToken.uid)
                    .then(({email,photoURL,displayName}) => {
                        const user:UserSmall = {
                            username : displayName || '',
                            email: email!,
                            photoUrl: photoURL

                        }
                        resolve(user)
                    });
            })
            .catch((err) => {
                console.error(err);
                resolve(null)
            });
    })
}
