import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
