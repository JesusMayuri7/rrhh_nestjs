import { ResponseModel } from 'src/core/app/entities/responde_model';

export interface AirhspRepositoryInterface {
  getAirhsp(): Promise<ResponseModel>;
}