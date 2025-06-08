import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.getUserIdFromClient(client);
      client.data.userId = userId;
      await this.userService.updateOnlineStatus(userId, true);
      // console.log(`User ${userId} connected`);
    } catch (error) {
      console.error('User connection failed:', error.message || error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userId = client.data.userId;
      if (userId) {
        await this.userService.updateOnlineStatus(userId, false);
        // console.log(`User ${userId} disconnected`);
      }
    } catch (error) {
      console.log('User disconnect, but no userId found');
    }
  }

  private getUserIdFromClient(client: Socket): number {
    const token = client.handshake.auth.token as string;
    if (!token) throw new Error('No token');

    const payload = this.jwtService.verify(token);
    return payload.id;
  }
}
