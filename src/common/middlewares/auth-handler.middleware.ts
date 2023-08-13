import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { mockUsers } from 'usermock';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthHandlerMiddleWare implements NestMiddleware {

  use(reqOrSocket: Socket | Request, _: Response, next: NextFunction) { 
    console.log("called");
    if (reqOrSocket instanceof Socket) {
      return this.handleSocket(reqOrSocket, next);
    } else {
      return this.handleHttp(reqOrSocket, next);
    }
  }

  private handleSocket(socket: Socket, next: NextFunction) {
    const userId = socket?.handshake?.headers?.authorization;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = mockUsers.find(user => user.id == +userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    socket['user'] = user.id;
    next();
  }

  private handleHttp(req: Request, next: NextFunction) {
    const userId = req?.headers?.authorization;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = mockUsers.find(user => user.id == +userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    (req as any).user = String(userId);
    next();
  }
}