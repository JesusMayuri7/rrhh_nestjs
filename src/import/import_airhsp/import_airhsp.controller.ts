import {Controller,Post,UseInterceptors,UploadedFile,UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ConsoleLogger} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as Excel from 'exceljs';
import {createWriteStream} from 'fs';
import { ImportService } from '../import.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { IsNumber } from 'class-validator';

@Controller('import-airhsp')
  export class ImportAirhspController {


constructor(private readonly importService: ImportService) {} 

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(@UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      ],
    })) file:Express.Multer.File) {

      const datosLaborales:Object[]= [];
      const codigosAir:Object[]= [];

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);
      var worksheet = workbook.worksheets[0];

     const rows = worksheet.getRow(4);

      for (let i=1; i<= rows.cellCount; i++) {
        if (Number.parseInt(rows.getCell(i).text)) {
          var codigoAirDetalle = [];  
          
          for(let rowIndex=5; rowIndex <= worksheet.actualRowCount;rowIndex++){
            const row = worksheet.getRow(rowIndex).getCell(i+1);
               codigoAirDetalle.push({valorCodigo : (row.text === '' || row.text === null) ? 0: Number.parseFloat(row.text?? '0'),codigoPlaza:'102022',descFuente:''});   
          }
          
          codigosAir.push({"modalidadId":1,"anio":"2023","codigo":rows.getCell(i).text,
          "descCodigo":rows.getCell(i+1).text,codigoAirDetalles:codigoAirDetalle})

          i=i+2;
        }
        else
        {       
          var datosLaboraleDetalle = [];   
          const cols = worksheet.getColumn(i);
          cols.eachCell((col,rowNumber)=>{
            if(rowNumber>4) {
              datosLaboraleDetalle.push({valor : col.value ?? '',codigoPlaza:'102022'});              
            } 
          });
          datosLaborales.push({"descDatoLaboral":rows.getCell(i).text,"modalidadId":1,
          "datoLaboralAirDetalles":datosLaboraleDetalle});
        }
      }

      const createdCodigosAir = await this.importService.createCodigosAir(codigosAir);
      //const createdDatosLaborales = await this.importService.createDatoLaborales(datosLaborales);
      
      

    //   const ws = createWriteStream('./uploads/'+file.originalname);
    //  ws.write(file.buffer);  

      return {
        data: [
          {"codigosAir": codigosAir},
         // {"datosLaborales": createdDatosLaborales}
        ]
      }   
    }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files[]', 10, { dest: './uploads', }))
    uploadMultiple(@UploadedFiles() files) {
      console.log(files);
    }
}
