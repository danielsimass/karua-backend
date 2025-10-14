import { Host } from '../entities/host.entity';
import { HostCreateData, HostUpdateData } from './types';

export interface IHostsRepository {
  /**
   * Cria uma nova instância de host (sem persistir)
   */
  create(data: HostCreateData): Host;

  /**
   * Salva um host no banco de dados
   */
  save(host: Host): Promise<Host>;

  /**
   * Busca um host por ID
   */
  findById(id: string, relations?: string[]): Promise<Host | null>;

  /**
   * Busca um host por CNPJ
   */
  findByCnpj(cnpj: string): Promise<Host | null>;

  /**
   * Busca todos os hosts
   */
  findAll(relations?: string[]): Promise<Host[]>;

  /**
   * Atualiza um host parcialmente
   */
  update(id: string, updateData: HostUpdateData): Promise<Host>;

  /**
   * Remove um host
   */
  remove(id: string): Promise<void>;
}
