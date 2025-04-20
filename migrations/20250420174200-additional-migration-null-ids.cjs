"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero eliminar la constraint existente
    await queryInterface.removeConstraint("tickets", "tickets_user_id_fkey");

    // Volver a agregar la constraint con ON DELETE SET NULL
    await queryInterface.addConstraint("tickets", {
      fields: ["user_id"],
      type: "foreign key",
      name: "tickets_user_id_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a la configuración original (sin onDelete específico)
    await queryInterface.removeConstraint("tickets", "tickets_user_id_fkey");

    await queryInterface.addConstraint("tickets", {
      fields: ["user_id"],
      type: "foreign key",
      name: "tickets_user_id_fkey",
      references: {
        table: "users",
        field: "id",
      },
    });
  },
};
