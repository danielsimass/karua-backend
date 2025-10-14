import {
  isValidCPF,
  isValidCNPJ,
  cleanDocument,
  formatCPF,
  formatCNPJ,
} from './document-validator.util';

describe('DocumentValidator', () => {
  describe('isValidCPF', () => {
    it('should validate a valid CPF without mask', () => {
      expect(isValidCPF('12345678909')).toBe(true);
      expect(isValidCPF('11144477735')).toBe(true);
    });

    it('should validate a valid CPF with mask', () => {
      expect(isValidCPF('123.456.789-09')).toBe(true);
      expect(isValidCPF('111.444.777-35')).toBe(true);
    });

    it('should invalidate CPF with all same digits', () => {
      expect(isValidCPF('11111111111')).toBe(false);
      expect(isValidCPF('000.000.000-00')).toBe(false);
    });

    it('should invalidate CPF with wrong length', () => {
      expect(isValidCPF('123456789')).toBe(false);
      expect(isValidCPF('123456789012345')).toBe(false);
    });

    it('should invalidate CPF with wrong check digits', () => {
      expect(isValidCPF('12345678900')).toBe(false);
      expect(isValidCPF('11144477736')).toBe(false);
    });

    it('should invalidate empty or null CPF', () => {
      expect(isValidCPF('')).toBe(false);
      expect(isValidCPF(null as any)).toBe(false);
      expect(isValidCPF(undefined as any)).toBe(false);
    });
  });

  describe('isValidCNPJ', () => {
    it('should validate a valid CNPJ without mask', () => {
      expect(isValidCNPJ('11222333000181')).toBe(true);
      expect(isValidCNPJ('11444777000161')).toBe(true);
    });

    it('should validate a valid CNPJ with mask', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
      expect(isValidCNPJ('11.444.777/0001-61')).toBe(true);
    });

    it('should invalidate CNPJ with all same digits', () => {
      expect(isValidCNPJ('11111111111111')).toBe(false);
      expect(isValidCNPJ('00.000.000/0000-00')).toBe(false);
    });

    it('should invalidate CNPJ with wrong length', () => {
      expect(isValidCNPJ('1122233300018')).toBe(false);
      expect(isValidCNPJ('112223330001811')).toBe(false);
    });

    it('should invalidate CNPJ with wrong check digits', () => {
      expect(isValidCNPJ('11222333000180')).toBe(false);
      expect(isValidCNPJ('11444777000160')).toBe(false);
    });

    it('should invalidate empty or null CNPJ', () => {
      expect(isValidCNPJ('')).toBe(false);
      expect(isValidCNPJ(null as any)).toBe(false);
      expect(isValidCNPJ(undefined as any)).toBe(false);
    });
  });

  describe('cleanDocument', () => {
    it('should remove all non-numeric characters', () => {
      expect(cleanDocument('123.456.789-09')).toBe('12345678909');
      expect(cleanDocument('11.222.333/0001-81')).toBe('11222333000181');
      expect(cleanDocument('abc123def456')).toBe('123456');
    });

    it('should handle empty or null values', () => {
      expect(cleanDocument('')).toBe('');
      expect(cleanDocument(null as any)).toBe('');
      expect(cleanDocument(undefined as any)).toBe('');
    });
  });

  describe('formatCPF', () => {
    it('should format a valid CPF', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });

    it('should not format invalid length CPF', () => {
      expect(formatCPF('123456789')).toBe('123456789');
      expect(formatCPF('123456789012')).toBe('123456789012');
    });

    it('should format CPF even if it has mask already', () => {
      expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
    });
  });

  describe('formatCNPJ', () => {
    it('should format a valid CNPJ', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
      expect(formatCNPJ('11444777000161')).toBe('11.444.777/0001-61');
    });

    it('should not format invalid length CNPJ', () => {
      expect(formatCNPJ('1122233300018')).toBe('1122233300018');
      expect(formatCNPJ('112223330001811')).toBe('112223330001811');
    });

    it('should format CNPJ even if it has mask already', () => {
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
    });
  });
});
