import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FileLog extends Document {
  @Prop({ required: true })
  originalFileName: string;

  @Prop({ required: true })
  processedFileName: string;

  @Prop({ required: true })
  s3OriginalUrl: string;

  @Prop({ required: true })
  s3ProcessedUrl: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const FileLogSchema = SchemaFactory.createForClass(FileLog);