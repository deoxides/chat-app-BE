import { Server, Socket as SocketIO } from "socket.io";

import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { ClientToServerEvents, InterServerEvents,ServerToClientEvents, SocketData } from './events';
import { getDoc, roomConverter } from '../../firebase/firestore';
import { Room, Message } from '../../models/room';
import { UserSmall } from '../../models/user';
import { getUsersByRoom } from '../../helpers/sockets';

const db = getFirestore();

const Socket = (server:Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>) =>{
    server.on("connect",(client:SocketIO<ClientToServerEvents>)=>{
        //on events
        client.on('createRoom', async(roomName,callback: any) => {
            if(server.sockets.adapter.rooms.get(roomName)){
                callback(null)
            }else{
                if(!await getDoc('Rooms',roomName)){
                    const newRoom = {name:roomName,messages:[]}
                    db.collection('Rooms').doc(roomName).withConverter(roomConverter).set(newRoom)
                    client.join(newRoom.name);
                    callback(newRoom)
                }else{
                    callback(null)
                }
            }
        });
        client.on('searchRoom', async(roomName:string,callback:any) => {
            const room = db.collection('Rooms').doc(roomName).get().then((result) => result.data() as Room)
            callback(await room)
        });
        client.on("joinRoom", async(roomName:string,callback:any) => {
            let room = await db.collection('Rooms').doc(roomName).get().then((result) => result.data() as Room)
            if(room){
                client.join(roomName)
                client.leave(client.id)
                const users:UserSmall[] = await getUsersByRoom(server,roomName)
                callback(room)
                server.to(roomName).emit('userJoined',users)
            }else{
                callback(null)
            }
            return room
        });
        client.on('newMessage',(newMessage:Message) => {
            const [room] = client.rooms;
            //Consumes one operation by message NOT recommended
            const roomRef = db.collection('Rooms').doc(room)
            roomRef.update({messages:FieldValue.arrayUnion(newMessage)})
            server.to(room).emit('newMessage',newMessage)
        })
        client.on('disconnecting',async() => {
            const [room] = client.rooms;
            client.leave(room);
            const users:UserSmall[] = await getUsersByRoom(server,room)
            server.to(room).emit('userLeft',users)
        })
    })
}

export default Socket;
