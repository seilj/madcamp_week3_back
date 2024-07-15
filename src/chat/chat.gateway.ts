import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3002, { cors: { origin: '*' } })
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
  handleJoinRoom(client: Socket, payload: { matchId: string }) {
    const { matchId } = payload;
    if (client) {
      console.log(`Attempting to join room ${matchId} for user ${client.id}`);
      try {
        client.join(matchId);
        console.log(`User ${client.id} joined room ${matchId}`);
      } catch (error) {
        console.error(`Error joining room ${matchId}:`, error);
      }
    } else {
      console.error('Client is undefined in handleJoinRoom');
    }
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(@MessageBody() message: { matchId: string; message: string }) {
    console.log(`Message received for room ${message.matchId}: ${message.message}`);
    this.server.to(message.matchId).emit('message', message.message);
    console.log(`Message sent to room ${message.matchId}: ${message.message}`);
  }
}