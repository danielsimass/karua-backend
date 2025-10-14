/**
 * Valida se um CPF é válido
 * @param cpf - CPF com ou sem máscara
 * @returns true se o CPF é válido, false caso contrário
 */
export function isValidCPF(cpf: string): boolean {
  if (!cpf) {
    return false;
  }

  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.charAt(10))) {
    return false;
  }

  return true;
}

/**
 * Valida se um CNPJ é válido
 * @param cnpj - CNPJ com ou sem máscara
 * @returns true se o CNPJ é válido, false caso contrário
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) {
    return false;
  }

  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) {
    return false;
  }

  return true;
}

/**
 * Remove caracteres não numéricos de um documento
 * @param document - Documento com ou sem máscara
 * @returns Documento apenas com números
 */
export function cleanDocument(document: string): string {
  if (!document) {
    return '';
  }
  return document.replace(/\D/g, '');
}

/**
 * Formata um CPF adicionando a máscara
 * @param cpf - CPF sem máscara (apenas números)
 * @returns CPF formatado (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cleanDocument(cpf);
  if (cleanCPF.length !== 11) {
    return cpf;
  }
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ adicionando a máscara
 * @param cnpj - CNPJ sem máscara (apenas números)
 * @returns CNPJ formatado (xx.xxx.xxx/xxxx-xx)
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cleanDocument(cnpj);
  if (cleanCNPJ.length !== 14) {
    return cnpj;
  }
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
