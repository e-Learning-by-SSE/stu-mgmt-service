import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from "config"
import { getConnection } from "typeorm";

async function bootstrap() {
  const serverConfig = config.get("server");
  const port = process.env.SERVER_PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Student-Management-System-API')
    .setDescription('The Student-Management-Sytem-API description.')
    .setVersion('1.0')
    .addTag("courses")
    .addTag("groups")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
