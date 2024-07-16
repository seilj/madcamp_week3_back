import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  // 알림 전송 로직을 여기에 작성합니다.
  async sendNotification(userId: string, message: string): Promise<void> {
    // 실제로 알림을 보내는 코드를 여기에 작성합니다.
    // 예: 이메일, 푸시 알림 등
    console.log(`Sending notification to user ${userId}: ${message}`);
  }
}