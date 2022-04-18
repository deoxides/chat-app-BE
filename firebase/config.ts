import admin, { ServiceAccount } from "firebase-admin";
import credentials from "./credentials.json";

const Config = {
  credential: admin.credential.cert(credentials as ServiceAccount),
  apiKey: "AIzaSyB06Cdxk5baKvUqVYiHdlmy_bZabche51o",
  authDomain: "chat-app-19d4a.firebaseapp.com",
  databaseURL: "https://chat-app-19d4a-default-rtdb.firebaseio.com",
  projectId: "chat-app-19d4a",
  storageBucket: "chat-app-19d4a.appspot.com",
  messagingSenderId: "616724493012",
  appId: "1:616724493012:web:bcce71f65e247aae214141",
};
export default Config;
