import { User } from '../entities/user.entity';
import { UserCreateData, UserUpdateData } from './types';

export interface IUsersRepository {
  /**
   * Cria uma nova instância de usuário (sem persistir)
   */
  create(data: UserCreateData): User;

  /**
   * Salva um usuário no banco de dados
   */
  save(user: User): Promise<User>;

  /**
   * Busca um usuário por ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca um usuário por ID e hostId
   */
  findByIdAndHostId(id: string, hostId: string): Promise<User | null>;

  /**
   * Busca um usuário por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca um usuário por email e hostId
   */
  findByEmailAndHostId(email: string, hostId: string): Promise<User | null>;

  /**
   * Busca um usuário por username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Busca um usuário por username e hostId
   */
  findByUsernameAndHostId(username: string, hostId: string): Promise<User | null>;

  /**
   * Busca todos os usuários de um host
   */
  findAllByHostId(hostId: string): Promise<User[]>;

  /**
   * Remove um usuário
   */
  remove(user: User): Promise<void>;
}

