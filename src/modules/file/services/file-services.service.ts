import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { XMLBuilder } from 'fast-xml-parser';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileLog } from '../entity/file.entity';

@Injectable()
export class FileService {
  private s3 = new AWS.S3();

  constructor(@InjectModel(FileLog.name) public readonly fileLogModel: Model<FileLog>) {}

  async uploadFileToS3(filePath: string, bucketName: string, key: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
    };
    const data = await this.s3.upload(params).promise();
    return data.Location;
  }

  async processFile(filePath: string): Promise<any> {
    const records = await this.parseCsv(filePath);

    // Eliminar duplicados
    const uniqueRecords = this.removeDuplicates(records);

    // Validar formato
    const validatedRecords = this.validateFormat(uniqueRecords);

    // Ordenar datos
    const sortedRecords = this.sortData(validatedRecords, 'columnName');

    // Convertir a XML
    const xmlData = this.convertToXml(sortedRecords);

    return xmlData;
  }

  async parseCsv(filePath: string): Promise<any[]> {
    const records = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true }))
        .on('data', (data) => records.push(data))
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }

  removeDuplicates(records: any[]): any[] {
    // Lógica para eliminar duplicados
    return Array.from(new Set(records.map(record => JSON.stringify(record)))).map(record => JSON.parse(record));
  }

  validateFormat(records: any[]): any[] {
    // Lógica para validar formato
    return records.filter(record => Object.values(record).every(value => value !== ''));
  }

  sortData(records: any[], column: string): any[] {
    // Lógica para ordenar datos
    return records.sort((a, b) => {
      const aValue = a[column] || '';
      const bValue = b[column] || '';
      return aValue.localeCompare(bValue);
    });
  }

  convertToXml(records: any[]): string {
    const builder = new XMLBuilder();
    return builder.build({ records });
  }

  async logFileProcessing(originalFileName: string, processedFileName: string, s3OriginalUrl: string, s3ProcessedUrl: string): Promise<void> {
    await new this.fileLogModel({
      originalFileName,
      processedFileName,
      s3OriginalUrl,
      s3ProcessedUrl,
    }).save();
  }
}