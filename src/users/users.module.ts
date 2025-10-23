import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersAdminController } from './users-admin.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
