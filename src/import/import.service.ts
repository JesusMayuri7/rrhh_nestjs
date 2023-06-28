import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import * as Excel from 'exceljs';
import { map } from 'rxjs/operators';

@Injectable()
export class ImportService {

    constructor(private readonly prismaService: PrismaService) {}

    async getCodigosAir() {
        var codigosAir = await this.prismaService.codigoAir.count.length;
        return codigosAir;
    }

    async createdCodigosAirExt() {
        // TODO

    }



    async createCodigosAir(codigoAir) {
        await this.prismaService.codigoAirDetalle.deleteMany();
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

        });
    }

    async getDatosLaborales() {
        var datosLaborales = await this.prismaService.datoLaboralAir.findMany();
        return datosLaborales;
    }

    async createDatoLaboralExt(datoLaboralExt) {
        await this.prismaService.datoLaboralAirExt.deleteMany();
       return await this.prismaService.datoLaboralAirExt.createMany({
           data:datoLaboralExt
       });
    }

    async createDatoLaborales(datosLaborales){
        let result;
        let countCreated=0;
        await this.prismaService.datoLaboralAirDetalle.deleteMany();
        await this.prismaService.datoLaboralAir.deleteMany();
        return datosLaborales.map(async (dato,index)=>{
            result = await this.prismaService.datoLaboralAir.create({
               data: {
                descDatoLaboral:dato.descDatoLaboral,
                modalidadId:dato.modalidadId,datoLaboralAirDetalles : {
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
        });
    }

    async createDatoLaboralDetalle(datoLaboralDetalle) {
        return await this.prismaService.datoLaboralAirDetalle.createMany({
          data:datoLaboralDetalle
        }); 
    }

    async getAirhsp() {
        return await this.prismaService.datoLaboralAirExt.findMany();
    }
}
