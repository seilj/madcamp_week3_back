import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3000, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('New user connected..', client.id);
    this.server.emit('user-joined', { message: `New User Joined the chat: ${client.id}` });
  }

  handleDisconnect(client: Socket) {
    console.log('user disconnected..', client.id);
    this.server.emit('user-left', { message: `User left the chat: ${client.id}` });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: { matchId: string; message: string }) {
    this.server.to(message.matchId).emit('message', message.message);
  }
}