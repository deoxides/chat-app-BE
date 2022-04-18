import { User } from 'firebase/auth';
import { Message,Room } from "../../models/room";
import { UserSmall } from '../../models/user';


export interface ServerToClientEvents {
  newMessage: ( message: Message) => void;
  userJoined: (users:UserSmall[]) => void;
  userLeft: ( users: UserSmall[]) => void;
}
export interface ClientToServerEvents {
  searchRoom: (name:string,response?:Room) => void;
  createRoom: (name:string,response:Room) => void;
  joinRoom: ( name: string,response:any) => Promise<Room> | Room;
  leaveRoom: ( name: string) => void;
  newRoom : (room:Room) => Room;
  newMessage: (message: Message) => void;
  newWhisper :(message: Message) => Message[];
}

export interface InterServerEvents{
  ping: () => void
}

export interface SocketData {
  payload:any;
}
