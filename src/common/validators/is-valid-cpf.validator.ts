import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidCPF } from '../utils/document-validator.util';

@ValidatorConstraint({ name: 'isValidCPF', async: false })
export class IsValidCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    return isValidCPF(cpf);
  }

  defaultMessage(): string {
    return 'CPF inválido';
  }
}

/**
 * Decorator para validar CPF usando class-validator
 * @param validationOptions - Opções de validação
 */
export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCPFConstraint,
    });
  };
}
