import { Module } from '@nestjs/common';
import { ImportAirhspController } from './import_airhsp/import_airhsp.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ImportService } from './import.service';

@Module({
  imports:[PrismaModule],
  controllers: [ImportAirhspController],
  providers: [ImportService]
})
export class ImportModule {}
