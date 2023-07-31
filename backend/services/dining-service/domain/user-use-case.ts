import * as userRepository from '../data-access/user-repository';

export async function getUsers() {
  // eslint-disable-next-line no-console
  console.log('it works');
  return await userRepository.getAllUsers();
}
