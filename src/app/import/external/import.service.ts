import { Injectable } from '@nestjs/common';
import { AirhspData } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ImportService {

    constructor(private readonly prismaService: PrismaService) {}

    async createCodigosAir(codigoAir) {
/*         await this.prismaService.codigoAirDetalle.deleteMany();
        await this.prismaService.codigoAirExt.deleteMany();
        await this.prismaService.codigoAir.deleteMany();

        return codigoAir.map(async (dato,index)=>{
            return await this.prismaService.codigoAir.create({
               data: {
                anio: dato.anio,
                codigo: dato.codigo,
                descCodigo:dato.descCodigo,
                modalidadId:dato.modalidadId,
                codigoAirDetalles : {
                    createMany: {
                        data: dato.codigoAirDetalles.map((detalle) => {
                            return  {
                                valorCodigo : detalle.valorCodigo,
                                codigoPlaza : detalle.codigoPlaza,
                                descFuente: detalle.descFuente
                            }
                         }),  
                    }
                }                              
                }
            });

        }); */
    }

    async createDatoLaboral(datoLaboralExt:[]):Promise<any> {
        return await this.prismaService.airhspData.createMany({
           data:datoLaboralExt
       });
    }

    async createAirhspFile(airhspFile):Promise<any> {

    return await this.prismaService.airhspFile.create({
           data:{
            fileUrl: airhspFile['fileUrl'],
            modalidadContratoId: airhspFile['modalidadContratoId'],
            airhspData: {
                createMany :{
                    data:airhspFile['airhspData']
                }
            }      
            
  /*               {
                create: airhspFile['airhspData'].map((airhspData)=>{
                    return {
                        codigoPlaza: airhspData.codigoPlaza,
                        modalidadContratoId: 1,
                        datoLaboral: airhspData['datoLaboral'],
                        codigosAir: airhspData['codigosAir'].map((detalle) => {
                            return  {
                                valor : detalle.valorCodigo,
                                codigoPlaza :  detalle.codigoPlaza,
                                descFuente :  detalle.descFuente,
                                descCodigo :  detalle.descCodigo,
                            }
                        }),
                    }
                    })                 
                }, */
            }
        });

  
    }

    async createDatoLaborales(datosLaborales){
/*         let result;
        let countCreated=0;
        await this.prismaService.datoLaboralAirDetalle.deleteMany();
        await this.prismaService.datoLaboralAir.deleteMany();
        return datosLaborales.map(async (dato,index)=>{
            result = await this.prismaService.datoLaboralAir.create({
               data: {
                descDatoLaboral:dato.descDatoLaboral,
                modalidadId:dato.modalidadId,
                datoLaboralAirDetalles : {
                    createMany: {
                        data: dato.datoLaboralAirDetalles.map((detalle) => {
                            return  {
                                valor : detalle.valor,
                                codigoPlaza : detalle.codigoPlaza
                            }
                         }),  
                    }
                }                                 
                }
            });
            if(result){
                console.log(result);
                countCreated+=1;
                console.log(countCreated);
            }
            return index;
        });*/
    } 


}
