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
    });
  },

  down: (queryInterface) => queryInterface.dropTable('Order'),
};
