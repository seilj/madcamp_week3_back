import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MyPlayerModule } from '../myplayer/myplayer.module';
import { FriendRequest, FriendRequestSchema } from 'src/schemas/friend_request.schema';
import { MeetingsModule } from 'src/meetings/meetings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema }
    ]),
    MeetingsModule,
    MyPlayerModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
