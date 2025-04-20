"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("tickets", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambiado a true para permitir valores nulos
    });
  },

  async down(queryInterface, Sequelize) {
    // En el rollback, volvemos a establecer allowNull: false
    await queryInterface.changeColumn("tickets", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
