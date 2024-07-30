import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file-services.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const uploadsDir = path.join(__dirname, '../../../uploads');

    // Verifica si el directorio 'uploads' existe, si no, créalo
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const originalFileUrl = await this.fileService.uploadFileToS3(filePath, bucketName, file.originalname);

    const processedData = await this.fileService.processFile(filePath);
    const processedFileName = `processed_${file.originalname}.xml`;
    const processedFilePath = path.join(uploadsDir, processedFileName);
    fs.writeFileSync(processedFilePath, processedData);

    const processedFileUrl = await this.fileService.uploadFileToS3(processedFilePath, bucketName, processedFileName);

    await this.fileService.logFileProcessing(
      file.originalname,
      processedFileName,
      originalFileUrl,
      processedFileUrl
    );

    res.header('count', processedData.split('\n').length.toString());
    res.sendFile(processedFilePath);
  }
}