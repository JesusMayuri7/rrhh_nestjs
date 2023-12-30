import { ResponseModel } from 'src/core/app/entities/responde_model';

import { AirhspRepositoryInterface } from '../domain/airhsp_repository';
import { GetAirhspService } from '../external/get_airhsp_service';

export class AirhspRepositoryImpl implements AirhspRepositoryInterface {

    constructor(private getAirhspService: GetAirhspService){}

    async getAirhsp(): Promise<any> {
        //console.log(datosLaboralExt);
        try {
            const dataCreated= await this.getAirhspService.getAirhsp();
            
            return {    
                status:true,    
                data:  dataCreated,
                message:"Datos Laborales"
            };   
        } catch (e){
            return {    
                status:false,    
                data: [],
                message:"Error en la creacion"
            };  
        }

}
}