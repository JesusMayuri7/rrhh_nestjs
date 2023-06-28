import {Controller,Post,UseInterceptors,UploadedFile,UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ConsoleLogger, Get} from '@nestjs/common';
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

    @Post('upload_ext')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExt(@UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      ],
    })) file:Express.Multer.File) {

      const datosLaboralExt:Object[]= [];
      const codigosAir:Object[]= [];

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);
      var worksheet = workbook.worksheets[0];

      const rowHeader = worksheet.getRow(4);
      
      for (let i=5; i<= worksheet.actualRowCount; i++) {
        let codigoPlaza = '000000';
        var datosLaboralJson = [];   
       
          const row = worksheet.getRow(i);            
          var rowJson = [];
          var codigoAirDetalle = [];  
          for (let colIndex=1; colIndex<= row.cellCount; colIndex++) {
              if (Number.parseInt(rowHeader.getCell(colIndex).text))
              {                        
                const codigo = rowHeader.getCell(colIndex);
                const valorCodigo = row.getCell(colIndex+1);
                const descFuente = row.getCell(colIndex+2);
                const descCodigo = rowHeader.getCell(colIndex+1);
                codigoAirDetalle.push({descCodigo:descCodigo.text,
                  codigo:codigo.text ,valorCodigo : (valorCodigo.text === '' || valorCodigo.text === null) ? 0: Number.parseFloat(valorCodigo.text?? '0'),descFuente:descFuente.text});                   
                colIndex=colIndex+2
              }
              else
              {
                if(rowHeader.getCell(colIndex).text=='CODIGO_PLAZA'){
                    codigoPlaza = row.getCell(colIndex).text;
                }
                const colName = rowHeader.getCell(colIndex).text;
                //rowJson[colName]= (row.getCell(colIndex).text == null || row.getCell(colIndex).text =='null' || row.getCell(colIndex).text =='NULL' || row.getCell(colIndex).text.length==0) ? '':row.getCell(colIndex).text;
                rowJson.push({[colName]: (row.getCell(colIndex).text == null || row.getCell(colIndex).text =='null' || row.getCell(colIndex).text =='NULL' || row.getCell(colIndex).text.length==0) ? '':row.getCell(colIndex).text});
              }
            }
            
          datosLaboralJson.push(rowJson);                        
          datosLaboralExt.push({"codigoPlaza":codigoPlaza,"modalidadId":1,"datoLaboral":datosLaboralJson[0],"codigosAir":codigoAirDetalle});        
      }

      //const createdCodigosAir = await this.importService.createCodigosAir(codigosAir);
      //const createdDatosLaborales = await this.importService.createDatoLaborales(datosLaborales);

     const createdDatoLaboralExt = await this.importService.createDatoLaboralExt(datosLaboralExt);
            

    //   const ws = createWriteStream('./uploads/'+file.originalname);
    //  ws.write(file.buffer);  

      return {        
        data: [
          //{"codigosAir": codigoAirDetalle},
          {"datosLaborales": createdDatoLaboralExt}
        ]
      }   
    }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files[]', 10, { dest: './uploads', }))
    uploadMultiple(@UploadedFiles() files) {
      console.log(files);
    }

    @Get('airhsp')
    async getAirhsp() {
      const response = await this.importService.getAirhsp();
      return {
        status:true,
        data: response,
        message:'Listado del Airhsp'
      }
    }
}
