import {Controller,Post,UseInterceptors,UploadedFile,UploadedFiles, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as Excel from 'exceljs';
import {createWriteStream} from 'fs'

  @Controller('import-airhsp')
  export class ImportAirhspController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingle(@UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      ],
    })) file:Express.Multer.File) {
       console.log('ok');
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);
      var worksheet = workbook.worksheets[0];
      worksheet.eachRow((row,rowNumber)=>{
        if(rowNumber == 4) {
          row.eachCell((celL) => {
            console.log(celL.text);
          });
        }
      });

      const ws = createWriteStream('./uploads/'+file.originalname);
      ws.write(file.buffer)
      //console.log(workbook.getWorksheet[0]);     
    
 
    }
    
    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files[]', 10, { dest: './uploads' }))
    uploadMultiple(@UploadedFiles() files) {
      console.log(files);
    }
  }
