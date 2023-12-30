import { ResponseModel } from 'src/core/app/entities/responde_model';
import { ImportRepositoryInterface } from '../domain/import_repository';
import { ImportService } from '../external/import.service';

export class ImportRepostoryImpl implements ImportRepositoryInterface {

    constructor(private importService: ImportService){}

    async createAirhspFile(airhsFile): Promise<ResponseModel> {
        try {
            const dataCreated= await this.importService.createAirhspFile(airhsFile);
            console.log(dataCreated);
            return {    
                status:true,    
                data: dataCreated,
                message:"Creacion exitosa"
            };   
        } catch (e){
            return {    
                status:false,    
                data: [],
                message:e
            };  
        }
    }

    async createDatosLaboralesAirhsp(datosLaboralExt:[]): Promise<any> {
        //console.log(datosLaboralExt);
        try {

            const dataCreated= await this.importService.createDatoLaboral(datosLaboralExt);
            
            return {    
                status:true,    
                data: dataCreated,
                message:"Creacion exitosa"
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