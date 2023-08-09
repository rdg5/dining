import { Static, Type } from '@sinclair/typebox';
import ajv from '@practica/validation';

export const loginSchema = Type.Object({
  email: Type.RegEx(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/),
  password: Type.String({ minLength: 8 }),
});

export type LoginUserDTO = Static<typeof loginSchema>;

export function loginUserValidator() {
  const validator = ajv.getSchema<LoginUserDTO>('login-user');
  if (!validator) {
    ajv.addSchema(loginSchema, 'login-user');
  }

  return ajv.getSchema<LoginUserDTO>('login-user')!;
}
