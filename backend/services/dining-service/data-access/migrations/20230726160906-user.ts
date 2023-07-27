module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      countryId: {
        type: Sequelize.INTEGER,
      },
      verifiedAt: {
        type: Sequelize.DATE,
      },
      verificationToken: {
        type: Sequelize.STRING,
      },
      verificationTokenExpiresAt: {
        type: Sequelize.DATE,
      },
      forgottenPasswordToken: {
        type: Sequelize.STRING,
      },
      forgottenPasswordTokenExpiresAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      permissionId: {
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
      },
      teamId: {
        type: Sequelize.INTEGER,
      },
    });

    await queryInterface.createTable('Team', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      permissionId: {
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
      },
    });

    await queryInterface.createTable('Role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      permissionId: {
        type: Sequelize.INTEGER,
      },
      teamId: {
        type: Sequelize.INTEGER,
      },
    });

    await queryInterface.createTable('Permission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ability: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.INTEGER,
      },
      teamId: {
        type: Sequelize.INTEGER,
      },
    });
  },

  down: (queryInterface) => queryInterface.dropTable('User'),
};
