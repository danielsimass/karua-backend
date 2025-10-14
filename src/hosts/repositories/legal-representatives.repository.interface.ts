import { LegalRepresentative } from '../entities/legal-representative.entity';
import { LegalRepresentativeCreateData, LegalRepresentativeUpdateData } from './types';

export interface ILegalRepresentativesRepository {
  /**
   * Cria uma nova instância de representante legal (sem persistir)
   */
  create(data: LegalRepresentativeCreateData): LegalRepresentative;

  /**
   * Salva um representante legal no banco de dados
   */
  save(legalRepresentative: LegalRepresentative): Promise<LegalRepresentative>;

  /**
   * Busca um representante legal por ID
   */
  findById(id: string): Promise<LegalRepresentative | null>;

  /**
   * Busca um representante legal por CPF
   */
  findByCpf(cpf: string): Promise<LegalRepresentative | null>;

  /**
   * Busca um representante legal por ID e hostId
   */
  findByIdAndHostId(id: string, hostId: string): Promise<LegalRepresentative | null>;

  /**
   * Busca todos os representantes legais de um host
   */
  findByHostId(hostId: string): Promise<LegalRepresentative[]>;

  /**
   * Remove um representante legal
   */
  remove(id: string): Promise<void>;
}
