/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import { AppError } from '@practica/error-handling';
import * as userRepository from '../data-access/user-repository';
import {
  addUserDTO,
  editUserDTO,
  editUserSchema,
  userSchema,
} from './userSchema';

export async function getUsers() {
  return await userRepository.getAllUsers();
}

export async function getUserById(userId: number) {
  return await userRepository.getUserByUserId(userId);
}

export async function getUsersWithTeams() {
  return await userRepository.getAllUsersWithTeams();
}

export async function createNewUser(requestBody) {
  assertUserIsValid(requestBody);
  await assertEmailAndUsernameAreUnique(requestBody);

  return await userRepository.saveNewUser(requestBody);
}

// TODO: add unique email and username check 
export async function editExistingUser(userId: number, requestBody) {
  assertEditingDataIsValid(requestBody);
  return await userRepository.updateExistingUser(userId, requestBody);
}

async function assertEmailAndUsernameAreUnique(requestBody: addUserDTO) {
  const { username, email } = requestBody;
  const alreadyExistingUser = await userRepository.getUserByUsernameOrEmail(
    username,
    email
  );

  if (alreadyExistingUser !== null) {
    const { username: existingUsername, email: existingEmail } =
      alreadyExistingUser;

    if (existingUsername === username) {
      throw new AppError(
        'validation-failed',
        `Username already in use`,
        409,
        true
      );
    }
    if (alreadyExistingUser !== null && existingEmail === email) {
      throw new AppError(
        'validation-failed',
        `Email already in use`,
        409,
        true
      );
    }
  }
}

function assertUserIsValid(userToBeCreated: addUserDTO) {
  const isValid = ajv.validate(userSchema, userToBeCreated);
  if (isValid === false) {
    throw new AppError('invalid-user-creation', `Validation failed`, 400, true);
  }
}

function assertEditingDataIsValid(userToBeEdited: editUserDTO) {
  const isValid = ajv.validate(editUserSchema, userToBeEdited);
  if (isValid === false) {
    throw new AppError('invalid-user-editing', `Validation failed`, 400, true);
  }
}
