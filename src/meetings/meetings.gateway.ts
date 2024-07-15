// meetings.gateway.ts (or equivalent WebSocket server code)
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './create-meeting.dto';
import { JoinMeetingDto } from './join-meeting.dto';

@WebSocketGateway()
export class MeetingsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly meetingsService: MeetingsService) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createMeeting')
  async create(@MessageBody() createMeetingDto: CreateMeetingDto): Promise<void> {
    const createdMeeting = await this.meetingsService.create(createMeetingDto);
    this.server.emit('meetingCreated', createdMeeting); // 브로드캐스트
  }

  @SubscribeMessage('joinMeeting')
  async join(@MessageBody() joinMeetingDto: JoinMeetingDto): Promise<void> {
    const updatedMeeting = await this.meetingsService.join(joinMeetingDto);
    this.server.emit('meetingUpdated', updatedMeeting); // 브로드캐스트
  }

  @SubscribeMessage('findAllMeetings')
  async findAll(): Promise<void> {
    const meetings = await this.meetingsService.findAll();
    this.server.emit('meetingsFound', meetings); // 브로드캐스트
  }
}