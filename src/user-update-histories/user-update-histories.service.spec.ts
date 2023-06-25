import { Test, TestingModule } from '@nestjs/testing';
import { UserUpdateHistoriesService } from './user-update-histories.service';

describe('UserUpdateHistoriesService', () => {
  let service: UserUpdateHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUpdateHistoriesService],
    }).compile();

    service = module.get<UserUpdateHistoriesService>(UserUpdateHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
