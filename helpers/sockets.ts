import { Server } from "socket.io";
import { UserSmall } from '../models/user';
import { getUserInfo } from "./jwt";

export const getUsersByRoom = async(server:Server,room:string):Promise<UserSmall[]> => {
    let users:UserSmall[] = []
    const clients = await server.in(room).fetchSockets();
    for(const client of clients){
        const user = await getUserInfo(client.handshake.auth.token)
        if(user){
            users.push(user);
        }
    }
    console.log(users)
    return users;
}