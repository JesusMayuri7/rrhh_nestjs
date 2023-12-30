import { Module } from '@nestjs/common';
import { ImportAirhspController } from './presenter/import_airhsp.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { ImportService } from './external/import.service';
import { ImportRepositoryInterface } from './domain/import_repository';
import { ImportRepostoryImpl } from './infra/import_repository_impl';
import { ImportFileUsecase } from './domain/import_file_usecase';

@Module({
  imports:[PrismaModule],
  controllers: [ImportAirhspController],
  providers: [ImportService,
    {
      provide: ImportRepostoryImpl,
      useFactory:(importService:ImportService)=>{
        return new ImportRepostoryImpl(importService);
      },
      inject:[ImportService]
    },
    {
      provide: ImportFileUsecase,
      useFactory: (repo: ImportRepositoryInterface)=> {
        return new ImportFileUsecase(repo);
      },
      inject: [ImportRepostoryImpl]
    }
  ]
})
export class ImportModule {}
