export interface HostCreateData {
  name: string;
  description?: string;
  cnpj?: string;
  cep?: string;
  street?: string;
  number?: string;
  state?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  legalRepresentatives?: LegalRepresentativeCreateData[];
}

export interface LegalRepresentativeCreateData {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}
