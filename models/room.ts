import {v4 as uuid} from 'uuid';
import { Observable,EMPTY } from 'rxjs';
import { getFirestore } from 'firebase-admin/firestore';
// import { getAllDocs } from '../firebase/firestore';
//User model
import { UserSmall } from "./user";

const db = getFirestore();

export interface Message{
    from:UserSmall,
    to?:UserSmall,
    body:string,
    createdAt:Date
}

export interface Room{
    name:string;
    messages : Message[]
}