/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import bcrypt from 'bcrypt';
import { AppError } from '@practica/error-handling';
import { addUserDTO, userSchema } from './Schemas/user-schema';
import * as userRepository from '../data-access/user-repository';
import * as authRepository from '../data-access/auth-repository';

export async function register(requestBody) {
  assertUserIsValid(requestBody);
  await assertEmailAndUsernameAreUnique(requestBody);
  requestBody.password = await bcrypt.hash(requestBody.password, 12);
  return await authRepository.saveNewUser(requestBody);
}

function assertUserIsValid(userToBeCreated: addUserDTO) {
  const isValid = ajv.validate(userSchema, userToBeCreated);
  if (isValid === false && ajv.errors) {
    const errorMessage = getCustomErrorMessage(ajv.errors);

    throw new AppError('invalid-user-registering', errorMessage, 400, true);
  }
}

async function assertEmailAndUsernameAreUnique(
  requestBody: addUserDTO,
  userId?: number
) {
  const { username, email } = requestBody;
  const alreadyExistingUser =
    await userRepository.getUserByUsernameOrEmailExceptCurrent(
      username,
      email,
      userId
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
    if (existingEmail === email) {
      throw new AppError(
        'validation-failed',
        `Email already in use`,
        409,
        true
      );
    }
  }
}

function getCustomErrorMessage(errors): string {
  let errorMessage = 'Validation failed: ';

  // eslint-disable-next-line no-restricted-syntax
  for (const error of errors) {
    console.log(error);
    switch (error.keyword) {
      case 'minLength':
        // eslint-disable-next-line no-case-declarations
        const field = error.instancePath.substring(1);
        errorMessage += `${field} ${error.message}. `;
        break;
      case 'pattern':
        if (error.dataPath === '.email') {
          errorMessage += `Invalid email format. `;
        }
        break;
      default:
        errorMessage += `${error.message}. `;
        break;
    }
  }
  return errorMessage;
}
