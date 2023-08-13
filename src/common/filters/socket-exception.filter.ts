// import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
// import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

// @Catch(WsException, HttpException)
// export class WebsocketExceptionsFilter implements ExceptionFilter  {
//   catch(exception: WsException | HttpException, host: ArgumentsHost) {
//     const client = host.switchToWs().getClient() as WebSocket;
//     const data = host.switchToWs().getData();
//     const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
//     const details = error instanceof Object ? { ...error } : { message: error };
//     client.send(JSON.stringify({
//       event: "error",
//       data: {
//         id: (client as any).id,
//         rid: data.rid,
//         ...details
//       }
//     }));
//   }
// }

// global-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Response , Request } from 'express';

@Catch(HttpException, WsException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const client: Socket | Request = host.switchToWs().getClient();
    const response: Response = ctx.getResponse<Response>();

    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.getError();
    }

    if (client instanceof Socket) {
      client.emit('exception', message);
    } else {
      response.status(status).json(message);
    }
  }
}