import { ResponseModel } from 'src/core/app/entities/responde_model';

export interface ImportRepositoryInterface {
  createDatosLaboralesAirhsp(datosLaboralExt:any[]): Promise<ResponseModel>;
  createAirhspFile(airhsFile): Promise<ResponseModel>;
}