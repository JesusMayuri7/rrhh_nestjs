import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoreModule } from './core/core.module';
import { ImportModule } from './app/import/import.module';
import { AirhspModule } from './app/airhsp/airhsp_module';

@Module({
  imports: [ImportModule, CoreModule,AirhspModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
