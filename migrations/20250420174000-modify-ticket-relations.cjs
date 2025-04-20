"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Paso 1: Eliminar la constraint existente
      await queryInterface.sequelize.query(`
        ALTER TABLE tickets 
        DROP CONSTRAINT IF EXISTS tickets_user_id_fkey
      `);

      // Paso 2: Agregar la nueva constraint con ON DELETE SET NULL
      await queryInterface.addConstraint("tickets", {
        fields: ["user_id"],
        type: "foreign key",
        name: "tickets_user_id_fkey", // Mantener el mismo nombre
        references: {
          table: "users",
          field: "id",
        },
        onDelete: "SET NULL", // Cambiado de CASCADE a SET NULL
        onUpdate: "CASCADE",
      });

      // Paso 3: Actualizar los tickets existentes con user_id no existente
      await queryInterface.sequelize.query(`
        UPDATE tickets 
        SET user_id = NULL 
        WHERE user_id IS NOT NULL 
        AND user_id NOT IN (SELECT id FROM users)
      `);
    } catch (error) {
      console.error("Error en la migración:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios
    await queryInterface.sequelize.query(`
      ALTER TABLE tickets 
      DROP CONSTRAINT IF EXISTS tickets_user_id_fkey
    `);

    await queryInterface.addConstraint("tickets", {
      fields: ["user_id"],
      type: "foreign key",
      name: "tickets_user_id_fkey",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE", // Volver a la configuración original
      onUpdate: "CASCADE",
    });
  },
};
