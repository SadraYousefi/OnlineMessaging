import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as exphbs from "express-handlebars"
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const server = express()
  const hbs = exphbs.create({
    extname: ".hbs" ,
    runtimeOptions: {allowProtoPropertiesByDefault: true}
  })

  server.engine('.hbs' , hbs.engine)
  server.set('view engine' , '.hbs')
  server.set('views' , 'views')

  
  const app = await NestFactory.create(AppModule , new ExpressAdapter(server));
  app.use(cookieParser());
  
    app.useGlobalPipes(new ValidationPipe({
    transform:true ,
    enableDebugMessages: true ,
    whitelist: true,
    disableErrorMessages: false,
    forbidNonWhitelisted: true,
  }));

  await app.listen(3000);
}
bootstrap();
