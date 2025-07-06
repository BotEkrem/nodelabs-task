import {Server} from 'socket.io';

export let io: Server;

export function setSocketIO(ioInstance: Server) {
    io = ioInstance;
}
