/* eslint-disable no-console */
import ajv from '@practica/validation/ajv-cache';
import bcrypt from 'bcrypt';
import * as configurationProvider from '@practica/configuration-provider';
import { AppError } from '@practica/error-handling';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { addUserDTO, userSchema } from './Schemas/user-schema';
import * as userRepository from '../data-access/user-repository';
import * as authRepository from '../data-access/auth-repository';
import { LoginUserDTO, loginSchema } from './Schemas/login-schema';

export async function register(requestBody) {
  assertUserIsValid(requestBody);
  await assertEmailAndUsernameAreUnique(requestBody);
  requestBody.password = await bcrypt.hash(requestBody.password, 12);
  return await authRepository.saveNewUser(requestBody);
}

export async function login(requestBody) {
  assertLoginIsValid(requestBody);
  return await assertLoginIsSuccessful(requestBody);
}

export function refreshTokenGenerator(jwtToken: string, refreshToken) {
  const validTokens = assertThatTokensAreValid(jwtToken, refreshToken);
  const newAccessToken = generateNewToken(validTokens);
  return { newAccessToken, refreshToken };
}

function assertUserIsValid(userToBeCreated: addUserDTO) {
  const isValid = ajv.validate(userSchema, userToBeCreated);
  if (isValid === false && ajv.errors) {
    const errorMessage = getCustomErrorMessage(ajv.errors);

    throw new AppError('invalid-user-registering', errorMessage, 400, true);
  }
}

function assertLoginIsValid(userToLogin: LoginUserDTO) {
  const isValid = ajv.validate(loginSchema, userToLogin);
  if (isValid === false && ajv.errors) {
    const errorMessage = getCustomErrorMessage(ajv.errors);

    throw new AppError('invalid-user-login', errorMessage, 400, true);
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
        `The provided credentials are already in use or invalid`,
        409,
        true
      );
    }
    if (existingEmail === email) {
      throw new AppError(
        'validation-failed',
        `The provided credentials are already in use or invalid`,
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
async function assertLoginIsSuccessful(requestBody) {
  const { email, password } = requestBody;
  try {
    const foundUser = await authRepository.getUserByUsername(email);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      throw new Error('Invalid email or password');
    }

    const expiryTimeForJwt = Math.floor(Date.now() / 1000) + 60 * 20;
    const jwtToken = jwt.sign(
      {
        exp: expiryTimeForJwt,
        id: foundUser.id,
        role: foundUser.Roles[0].role,
      },
      configurationProvider.getValue('jwtTokenSecret')
    );

    const expiryTimeForRefreshToken =
      Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const refreshToken = jwt.sign(
      {
        exp: expiryTimeForRefreshToken,
        id: foundUser.id,
      },
      configurationProvider.getValue('refreshTokenSecret')
    );

    return { jwtToken, expiryTimeForJwt, refreshToken };
  } catch (error) {
    throw new AppError(
      'authentication-error',
      'Authentication failed',
      400,
      true
    );
  }
}

function assertThatTokensAreValid(jwtToken: string, refreshToken: string) {
  const accessTokenPayload = jwt.verify(
    jwtToken,
    configurationProvider.getValue('jwtTokenSecret')
  ) as JwtPayload;
  if (!accessTokenPayload) {
    throw new AppError('verification-error', 'Invalid token', 400, true);
  }
  const { role, id } = accessTokenPayload;
  const refresHTokenPayload = jwt.verify(
    refreshToken,
    configurationProvider.getValue('refreshTokenSecret')
  ) as JwtPayload;
  if (!refresHTokenPayload) {
    throw new AppError(
      'verification-error',
      'Invalid refresh token',
      400,
      true
    );
  }

  return { role, id };
}

function generateNewToken(validTokenPayload: JwtPayload) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 20,
      id: validTokenPayload.id,
      role: validTokenPayload.role,
    },
    configurationProvider.getValue('jwtTokenSecret')
  );
}
