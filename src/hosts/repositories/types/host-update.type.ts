export interface HostUpdateData {
  description?: string;
  cep?: string;
  street?: string;
  number?: string;
  state?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface LegalRepresentativeUpdateData {
  email?: string;
  phone?: string;
}
