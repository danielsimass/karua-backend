import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verify if email already exists for this host
    const existingUserByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        hostId: createUserDto.hostId,
      },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado para este estabelecimento');
    }

    // Verify if username already exists for this host
    const existingUserByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
        hostId: createUserDto.hostId,
      },
    });

    if (existingUserByUsername) {
      throw new ConflictException('Username já cadastrado para este estabelecimento');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(hostId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, hostId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, hostId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string, hostId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, hostId },
    });
  }

  async update(id: string, hostId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, hostId);

    // Verify if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: updateUserDto.email,
          hostId,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado para este estabelecimento');
      }
    }

    // Verify if username is being changed and if it already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: {
          username: updateUserDto.username,
          hostId,
        },
      });

      if (existingUser) {
        throw new ConflictException('Username já cadastrado para este estabelecimento');
      }
    }

    // Update user
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async changePassword(
    userId: string,
    hostId: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.findOne(userId, hostId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async deactivate(id: string, hostId: string): Promise<User> {
    const user = await this.findOne(id, hostId);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async activate(id: string, hostId: string): Promise<User> {
    const user = await this.findOne(id, hostId);
    user.isActive = true;
    return this.userRepository.save(user);
  }

  async remove(id: string, hostId: string): Promise<void> {
    const user = await this.findOne(id, hostId);
    await this.userRepository.remove(user);
  }
}
