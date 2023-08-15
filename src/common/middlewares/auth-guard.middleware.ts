import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction , Request , Response } from "express";

export class AuthMiddleWare implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const token = req?.cookies?.token ;
        if(!token)
            throw new UnauthorizedException("Unauthorized") ;

        (req as any).user = token ;

        next() ;
    }
}