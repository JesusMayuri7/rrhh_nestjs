import {Controller, Get} from '@nestjs/common';

import { GetAirhspUsecase } from '../domain/get_airhsp_usecase';


@Controller('airhsp')
  export class AirhspController {

  constructor(private getAirhspUsecase:GetAirhspUsecase) {} 

  @Get('datos_laborales')
    async getAirhsp() {
      return await this.getAirhspUsecase.execute();
    }
}