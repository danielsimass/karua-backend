import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidCNPJ } from '../utils/document-validator.util';

@ValidatorConstraint({ name: 'isValidCNPJ', async: false })
export class IsValidCNPJConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string): boolean {
    return isValidCNPJ(cnpj);
  }

  defaultMessage(): string {
    return 'CNPJ inválido';
  }
}

/**
 * Decorator para validar CNPJ usando class-validator
 * @param validationOptions - Opções de validação
 */
export function IsValidCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCNPJConstraint,
    });
  };
}
