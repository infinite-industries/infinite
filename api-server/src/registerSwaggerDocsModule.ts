import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export default function registerSwaggerDocsModule(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Infinite API')
    .setDescription(
      'An api for discovering cultural evens in Lexington Kentucky and surrounding areas',
    )
    .setVersion('1.0')
    .addTag('infinite')
    .addBearerAuth({
      description: 'authorization for administrative endpoints',
      type: 'apiKey',
      name: 'x-access-token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
