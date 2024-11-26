import { Test, TestingModule } from '@nestjs/testing';

import { CustomizeJwtService } from './jwt.service';

describe('JwtService', () => {
  let service: CustomizeJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomizeJwtService],
    }).compile();

    service = module.get<CustomizeJwtService>(CustomizeJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
