import {Controller,Post,UseInterceptors,UploadedFile,UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ConsoleLogger, Get, Body, HttpException, HttpStatus, ParseFilePipeBuilder} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as Excel from 'exceljs';
import {createWriteStream} from 'fs';
import { ImportService } from '../external/import.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { IsNumber } from 'class-validator';
import { ImportFileUsecase } from '../domain/import_file_usecase';
import { AirhspFileDto } from './dto/airhsp_file_dto';

@Controller('import')
  export class ImportAirhspController {

constructor(private readonly importService: ImportService,private importFileUsecase:ImportFileUsecase) {} 

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(@UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'application/xlsx' }),
      ],
    })) file:Express.Multer.File) {

      const datosLaborales:Object[]= [];
      const codigosAir:Object[]= [];
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);
      var worksheet = workbook.worksheets[0];

     const rowHeader = worksheet.getRow(4);

      for (let i=1; i<= rowHeader.cellCount; i++) {
        if (Number.parseInt(rowHeader.getCell(i).text)) {
          var codigoAirDetalle = [];  
          
          for(let rowIndex=5; rowIndex <= worksheet.actualRowCount;rowIndex++){
            const row = worksheet.getRow(rowIndex).getCell(i+1);
               codigoAirDetalle.push({valorCodigo : (row.text === '' || row.text === null) ? 0: Number.parseFloat(row.text?? '0'),codigoPlaza:'102022',descFuente:''});   
          }
          
          codigosAir.push({"modalidadId":1,"anio":"2023","codigo":rowHeader.getCell(i).text,
          "descCodigo":rowHeader.getCell(i+1).text,codigoAirDetalles:codigoAirDetalle})
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
          datosLaborales.push({"descDatoLaboral":rowHeader.getCell(i).text,"modalidadId":1,
          "datoLaboralAirDetalles":datosLaboraleDetalle});
        }
      }

      const createdCodigosAir = await this.importService.createCodigosAir(codigosAir);
      const createdDatosLaborales = await this.importService.createDatoLaborales(datosLaborales);
      
      

    //   const ws = createWriteStream('./uploads/'+file.originalname);
    //  ws.write(file.buffer);  

      return {
        data: [
          {"codigosAir": codigosAir},
          {"datosLaborales": createdDatosLaborales}
        ]
      }   
    }


    @Post('airhsp_file')    
    @UseInterceptors(FileInterceptor('file'))
    async subir(
      @Body() body:AirhspFileDto,
      @UploadedFile( new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'sheet',
      })
      .addMaxSizeValidator({
        maxSize: 1000 * 1024 * 1024
      })
      .build({
        exceptionFactory(error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        },
      }),) file:Express.Multer.File) {
     body.file = file;
          return this.importFileUsecase.execute(body);
    }
  }
