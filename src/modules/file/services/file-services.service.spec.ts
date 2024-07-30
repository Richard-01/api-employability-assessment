import { Test, TestingModule } from '@nestjs/testing';
import { FileServicesService } from './file-services.service';

describe('FileServicesService', () => {
  let service: FileServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileServicesService],
    }).compile();

    service = module.get<FileServicesService>(FileServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
