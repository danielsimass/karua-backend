import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersRepository } from './repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.usersRepository.findByEmailAndHostId(
      createUserDto.email,
      createUserDto.hostId
    );

    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado para este estabelecimento');
    }

    const existingUserByUsername = await this.usersRepository.findByUsernameAndHostId(
      createUserDto.username,
      createUserDto.hostId
    );

    if (existingUserByUsername) {
      throw new ConflictException('Username já cadastrado para este estabelecimento');
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : undefined;

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
      hostId: createUserDto.hostId,
    });

    return this.usersRepository.save(user);
  }

  async findAll(hostId: string): Promise<User[]> {
    return this.usersRepository.findAllByHostId(hostId);
  }

  async findOne(id: string, hostId: string): Promise<User> {
    const user = await this.usersRepository.findByIdAndHostId(id, hostId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async update(id: string, hostId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, hostId);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmailAndHostId(
        updateUserDto.email,
        hostId
      );

      if (existingUser) {
        throw new ConflictException('Email já cadastrado para este estabelecimento');
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usersRepository.findByUsernameAndHostId(
        updateUserDto.username,
        hostId
      );

      if (existingUser) {
        throw new ConflictException('Username já cadastrado para este estabelecimento');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async changePassword(
    userId: string,
    hostId: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.findOne(userId, hostId);

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Senha atual incorreta');
      }
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    user.password = hashedPassword;
    user.isFirstLogin = false;
    await this.usersRepository.save(user);
  }

  async updateUserPassword(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async deactivate(id: string, hostId: string): Promise<User> {
    const user = await this.findOne(id, hostId);
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async activate(id: string, hostId: string): Promise<User> {
    const user = await this.findOne(id, hostId);
    user.isActive = true;
    return this.usersRepository.save(user);
  }

  async remove(id: string, hostId: string): Promise<void> {
    const user = await this.findOne(id, hostId);
    await this.usersRepository.remove(user);
  }
}
