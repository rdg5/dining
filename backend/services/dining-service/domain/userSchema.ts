import { Static, Type } from '@sinclair/typebox';
import ajv from '@practica/validation';

export const userSchema = Type.Object({
  username: Type.String(),
  email: Type.String(),
  password: Type.String(),
});

export type addUserDTO = Static<typeof userSchema>;

export function addUserValidator() {
  const validator = ajv.getSchema<addUserDTO>('add-user');
  if (!validator) {
    ajv.addSchema(userSchema, 'add-user');
  }

  return ajv.getSchema<addUserDTO>('add-user')!;
}
