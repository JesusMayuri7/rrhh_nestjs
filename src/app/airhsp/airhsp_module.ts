import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { AirhspRepositoryInterface } from './domain/airhsp_repository';
import { GetAirhspUsecase } from './domain/get_airhsp_usecase';
import { AirhspController } from './presenter/airhsp_controller';
import { GetAirhspService } from './external/get_airhsp_service';
import { AirhspRepositoryImpl } from './infra/airhsp_repository_impl';




@Module({
  imports:[PrismaModule],
  controllers: [AirhspController],
  providers: [GetAirhspService,
    {
      provide: AirhspRepositoryImpl,
      useFactory:(importService:GetAirhspService)=>{
        return new AirhspRepositoryImpl(importService);
      },
      inject:[GetAirhspService]
    },
    {
      provide: GetAirhspUsecase,
      useFactory: (repo: AirhspRepositoryInterface)=> {
        return new GetAirhspUsecase(repo);
      },
      inject: [AirhspRepositoryImpl]
    }
  ]
})
export class AirhspModule {}