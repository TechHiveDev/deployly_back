import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class WorkerGateway implements OnGatewayConnection {

  async handleConnection(socket: Socket) {

  }

  @WebSocketServer()
  server: Server;
}
