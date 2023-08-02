import { Static, Type } from '@sinclair/typebox';
import ajv from '@practica/validation';

export const userSchema = Type.Object({
  username: Type.String(),
  email: Type.String(),
  password: Type.String(),
});

export const editUserSchema = Type.Object(
  {
    username: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    password: Type.Optional(Type.String()),
  },
  { additionalProperties: false, minProperties: 1 }
);

export type addUserDTO = Static<typeof userSchema>;
export type editUserDTO = Static<typeof editUserSchema>;

export function addUserValidator() {
  const validator = ajv.getSchema<addUserDTO>('add-user');
  if (!validator) {
    ajv.addSchema(userSchema, 'add-user');
  }

  return ajv.getSchema<addUserDTO>('add-user')!;
}

export function editUserValidator() {
  const validator = ajv.getSchema<editUserDTO>('edit-user');
  if (!validator) {
    ajv.addSchema(editUserSchema, 'edit-user');
  }

  return ajv.getSchema<editUserDTO>('edit-user')!;
}
