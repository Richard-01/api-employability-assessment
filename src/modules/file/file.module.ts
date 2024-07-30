import { Module } from '@nestjs/common';
import { FileService } from './services/file-services.service';
import { FileController } from './controller/file-controller.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileLog, FileLogSchema } from './entity/file.entity';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileLog.name, schema: FileLogSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
