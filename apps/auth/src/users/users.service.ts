import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDTO) {
    await this.validateCreateUserDTO(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDTO(createUserDto: CreateUserDTO){
    try {
      await this.usersRepository.findOne({email: createUserDto.email})
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException("Email already exists.")
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('Credentials not valid.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserDTO: GetUserDto){
    return this.usersRepository.findOne(getUserDTO);
  }
}
