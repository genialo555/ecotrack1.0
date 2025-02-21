import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './ws-jwt.guard';
import { TrackingService } from '../tracking.service';
import { LocationUpdateDto } from '../dto/location-update.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  constructor(private readonly trackingService: TrackingService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.set(userId, client);
      await this.trackingService.setUserActive(userId, true);
      this.broadcastUserStatus(userId, true);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      await this.trackingService.setUserActive(userId, false);
      this.broadcastUserStatus(userId, false);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(client: Socket, payload: LocationUpdateDto) {
    const userId = client.handshake.auth.userId;
    if (!userId) return;

    // Sauvegarder la position
    const location = await this.trackingService.updateUserLocation(userId, payload);

    // Notifier les admins et autres utilisateurs concernés
    this.server.to('admins').emit('locationUpdate', {
      userId,
      location,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribeToUser')
  handleSubscribeToUser(client: Socket, userId: string) {
    client.join(`user:${userId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('unsubscribeFromUser')
  handleUnsubscribeFromUser(client: Socket, userId: string) {
    client.leave(`user:${userId}`);
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    this.server.to('admins').emit('userStatus', {
      userId,
      isOnline,
    });
  }
} 