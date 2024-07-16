import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('New user connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, payload: { matchId: string, userName: string }) {
    const { matchId, userName } = payload;
    if (client) {
      console.log(`Attempting to join room ${matchId} for user ${userName}`);
      try {
        client.join(matchId);
        console.log(`User ${userName} joined room ${matchId}`);
        this.server.to(matchId).emit('userJoined', { userName });
      } catch (error) {
        console.error(`Error joining room ${matchId}:`, error);
      }
    } else {
      console.error('Client is undefined in handleJoinRoom');
    }
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: { matchId: string; message: string; userName: string }) {
    const { matchId, message: msg, userName } = message;
    console.log(`Message received from ${userName} for room ${matchId}: ${msg}`);
    this.server.to(matchId).emit('message', { message: msg, userName });
    console.log(`Message sent to room ${matchId}: ${msg}`);
  }
}