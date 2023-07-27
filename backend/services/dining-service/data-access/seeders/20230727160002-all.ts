/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert users
    await queryInterface.bulkInsert('User', [
      { username: 'user1', email: 'user1@example.com', password: 'password1' },
      { username: 'user2', email: 'user2@example.com', password: 'password2' },
      { username: 'user3', email: 'user3@example.com', password: 'password3' },
    ]);

    // Insert permissions
    await queryInterface.bulkInsert('Permission', [
      { ability: 'Read' },
      { ability: 'Write' },
      { ability: 'Delete' },
    ]);

    await queryInterface.bulkInsert('Team', [
      { name: 'Team A' },
      { name: 'Team B' },
      { name: 'Team C' },
    ]);

    await queryInterface.bulkInsert('Role', [
      { role: 'Admin' },
      { role: 'Member' },
    ]);

    await queryInterface.bulkInsert('UserPermission', [
      { userId: 1, permissionId: 1 },
      { userId: 2, permissionId: 2 },
      { userId: 3, permissionId: 3 },
    ]);

    await queryInterface.bulkInsert('UserTeam', [
      { userId: 1, teamId: 1 },
      { userId: 2, teamId: 2 },
      { userId: 3, teamId: 3 },
    ]);

    await queryInterface.bulkInsert('UserRole', [
      { userId: 1, roleId: 1 },
      { userId: 2, roleId: 2 },
      { userId: 3, roleId: 2 },
    ]);
  },

  down: (queryInterface) =>
    Promise.all([
      queryInterface.bulkDelete('User', null, {}),
      queryInterface.bulkDelete('Permission', null, {}),
      queryInterface.bulkDelete('Team', null, {}),
      queryInterface.bulkDelete('Role', null, {}),
      queryInterface.bulkDelete('UserPermission', null, {}),
      queryInterface.bulkDelete('UserTeam', null, {}),
      queryInterface.bulkDelete('UserRole', null, {}),
    ]),
};
