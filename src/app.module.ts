import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence/persistence.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/dbConfig';
import { FileModule } from './modules/file/file.module';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [dbConfig],
        envFilePath: '.env',
      }),
      PersistenceModule,
      FileModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
