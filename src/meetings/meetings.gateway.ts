// meetings.gateway.ts (or equivalent WebSocket server code)
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';

@WebSocketGateway({ cors: { origin: '*' } } )
export class MeetingsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly meetingsService: MeetingsService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
    client.emit('welcome', { event: 'welcome', message: 'Welcome to the WebSocket server!' });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createMeeting')
async create(@MessageBody() createMeetingDto: CreateMeetingDto): Promise<void> {
  try {
    const createdMeeting = await this.meetingsService.create(createMeetingDto);
    console.log('Meeting created successfully:', createdMeeting);
    this.server.emit('meetingCreated', createdMeeting); // 브로드캐스트
  } catch (error) {
    console.error('Error creating meeting:', error);
    this.server.emit('createMeetingError', { error: error.message }); // 에러 전송
  }
}

@SubscribeMessage('joinMeeting')
async join(client: Socket, @MessageBody() joinMeetingDto: JoinMeetingDto): Promise<void> {
  try {
    console.log('Received joinMeeting event:', joinMeetingDto);
    const updatedMeeting = await this.meetingsService.join(joinMeetingDto);
    console.log('Meeting updated:', updatedMeeting);
    
    // 클라이언트에게 업데이트된 미팅 정보를 전송합니다.
    this.server.emit('meetingUpdated', updatedMeeting);
  } catch (error) {
    console.error('Error joining meeting:', error);
    // 클라이언트에게 에러를 전송합니다.
    client.send(JSON.stringify({ event: 'joinMeetingError', error: error.message }));
  }
}

  @SubscribeMessage('findAllMeetings')
  async findAll(client: Socket): Promise<void> {
    console.log('Received findAllMeeting event');
    const meetings = await this.meetingsService.findAll();
    console.log('Meetings found:', meetings);
    client.send(JSON.stringify({ event: 'meetingsFound', data: meetings })); // 브로드캐스트
  }
}
