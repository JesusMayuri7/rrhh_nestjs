import * as Excel from 'exceljs';
import {createWriteStream} from 'fs';
import { IsNumber } from 'class-validator';
import { ImportRepositoryInterface } from './import_repository';
import { HttpException, HttpStatus, Body } from '@nestjs/common';
import { AirhspFileDto } from '../presenter/dto/airhsp_file_dto';

export class ImportFileUsecase {

    constructor(private importReposittoyI: ImportRepositoryInterface) {}

    async execute(body:AirhspFileDto):Promise<any> {
 
      const datosLaboralExt= [];

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(body.file.buffer);
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
        if(codigoPlaza == '000000'){
          throw new HttpException('Error, no existe el campo CODIGO_PLAZA', HttpStatus.NOT_ACCEPTABLE );
        }
            
          datosLaboralJson.push(rowJson);                        
          datosLaboralExt.push({"codigoPlaza":codigoPlaza,"modalidadContratoId":1,"datoLaboral":datosLaboralJson[0],"codigosAir":codigoAirDetalle});        
      }

      var dateCurrent  = new Date();
      var fechaFile = `${dateCurrent.getFullYear()}-${dateCurrent.getMonth()+1}-${dateCurrent.getDate()}_${dateCurrent.getHours()}-${dateCurrent.getMinutes()}-${dateCurrent.getSeconds()}`;
      var fileName =`${fechaFile}_ReporteDatosLaborales_${body.modalidadContratoId}.xlsx`;
      const airhspFIle = {
        "modalidadContratoId":body.modalidadContratoId,
        "fileUrl": fileName,
        "airhspData":datosLaboralExt
      }
           
    const createdAirhspFile= await this.importReposittoyI.createAirhspFile(airhspFIle);  
    //console.log(createdAirhspFile);          

    //   const ws = createWriteStream('./uploads/'+file.originalname);
    //  ws.write(file.buffer);  

      return  createdAirhspFile
    
    }
    
    }
