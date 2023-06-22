import { Module } from '@nestjs/common';
import { ImportAirhspController } from './import_airhsp/import_airhsp.controller';

@Module({
  controllers: [ImportAirhspController]
})
export class ImportModule {}
