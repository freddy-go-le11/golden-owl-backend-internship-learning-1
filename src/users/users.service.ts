import { Injectable, NotFoundException } from '@nestjs/common';
import { UserCreateDTO, UserFindOneDto, UserUpdateDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userCreateDto: UserCreateDTO) {
    const user = this.userRepository.create(userCreateDto);
    return this.userRepository.save(user);
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

  delete(id: number) {
    return this.userRepository.delete(id);
  }
}
