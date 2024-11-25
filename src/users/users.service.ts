import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateDTO, UserFindOneDto, UserUpdateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ENUM_POSTGRES_ERROR_CODE } from 'src/common/enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userCreateDto: UserCreateDTO) {
    try {
      const user = this.userRepository.create(userCreateDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === ENUM_POSTGRES_ERROR_CODE.UniqueViolation
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error; // Rethrow the error if it's not related to the unique constraint
    }
  }

  // TODO: Implement pagination, filtering, and sorting
  findAll() {
    return this.userRepository.find();
  }

  async findOne(userFindOneDto: UserFindOneDto) {
    const user = await this.userRepository.findOneBy(userFindOneDto);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, userUpdateDto: UserUpdateDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = this.userRepository.merge(user, userUpdateDto);

    return this.userRepository.save(updatedUser);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
