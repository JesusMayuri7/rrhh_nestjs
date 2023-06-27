import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImportModule } from './import/import.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [ImportModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
