"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- Insertar Departamentos ---
    await queryInterface.bulkInsert(
      "departments",
      [
        { name: "Finanzas", createdAt: new Date(), updatedAt: new Date() },
        { name: "Social", createdAt: new Date(), updatedAt: new Date() },
        { name: "Informática", createdAt: new Date(), updatedAt: new Date() },
        { name: "Tránsito", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );

    // --- Insertar Prioridades (con IDs específicos) ---
    // ¡IMPORTANTE! Esto asume que la tabla está vacía o que estos IDs no existen.
    await queryInterface.bulkInsert(
      "priorities",
      [
        { id: 1, name: "Alta", createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: "Media", createdAt: new Date(), updatedAt: new Date() },
        { id: 3, name: "Baja", createdAt: new Date(), updatedAt: new Date() },
      ],
      {}
    );

    // --- Insertar Estados (Status) (con IDs específicos) ---
    // ¡IMPORTANTE! Esto asume que la tabla está vacía o que estos IDs no existen.
    // ID 1 debe ser 'Abierto' para coincidir con el defaultValue en la migración de Tickets.
    await queryInterface.bulkInsert(
      "status",
      [
        {
          id: 1,
          name: "Abierto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { id: 2, name: "Leído", createdAt: new Date(), updatedAt: new Date() },
        {
          id: 3,
          name: "Pausado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Cerrado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // --- Insertar Categorías (ACTUALIZADO) ---
    await queryInterface.bulkInsert(
      "categories",
      [
        { name: "Computador", createdAt: new Date(), updatedAt: new Date() },
        { name: "Internet", createdAt: new Date(), updatedAt: new Date() },
        {
          name: "Teléfono/Impresora/Otros",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mi problema es otro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Elimina los datos. El orden aquí es menos crítico que en las migraciones
    // siempre que no haya FKs *entre* estas tablas de lookup.
    await queryInterface.bulkDelete("categories", null, {}); // Borra categorías
    await queryInterface.bulkDelete("status", null, {}); // Borra status
    await queryInterface.bulkDelete("priorities", null, {}); // Borra prioridades
    await queryInterface.bulkDelete("departments", null, {}); // Borra departamentos
  },
};
