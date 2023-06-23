import {Controller,Post,UseInterceptors,UploadedFile,UploadedFiles} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('import-airhsp')
  export class ImportAirhspController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    uploadSingle(@UploadedFile() file) {
      console.log(file);
    }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files[]', 10, { dest: './uploads', }))
    uploadMultiple(@UploadedFiles() files) {
      console.log(files);
    }
}
