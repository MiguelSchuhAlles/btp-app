import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CountriesModule } from './countries/countries.module';
import { RequestDataExtractorMiddleware } from './middleware/request-data-extractor.middleware';

@Module({
  imports: [
    CountriesModule,
    ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestDataExtractorMiddleware)
      .forRoutes('*');
  }
}
