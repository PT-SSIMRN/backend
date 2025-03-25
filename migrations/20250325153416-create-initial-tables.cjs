"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla Departments
    await queryInterface.createTable("departments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT, // o STRING
        allowNull: false,
        unique: true, // Asumiendo que los nombres de departamento son únicos
      },
      createdAt: {
        // Sequelize maneja timestamps si están habilitados en el modelo
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Users
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.TEXT, // o STRING
        allowNull: false,
        unique: true,
      },
      password: {
        // Guarda hashes, no texto plano
        type: Sequelize.TEXT, // o STRING
        allowNull: false,
      },
      isadmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // O true si un usuario puede no tener departamento
        references: {
          model: "departments", // Nombre de la tabla referenciada
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // O 'SET NULL' si allowNull es true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Categories
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Priorities
    await queryInterface.createTable("priorities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Status
    await queryInterface.createTable("status", {
      // Nombre en minúscula y plural es convención
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Tickets
    await queryInterface.createTable("tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      message: {
        type: Sequelize.TEXT, // TEXT permite mensajes más largos
        allowNull: false,
      },
      status: {
        // Nombre de columna debe coincidir con foreignKey en index.js
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // Asumiendo que ID 1 es 'Abierto'
        references: {
          model: "status", // Nombre de la tabla referenciada
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // Importante definir comportamiento
      },
      user_id: {
        // Nombre de columna debe coincidir con foreignKey en index.js
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // O 'SET NULL' si quieres mantener tickets de usuarios borrados
      },
      category: {
        // Nombre de columna debe coincidir con foreignKey en index.js
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      priority: {
        // Nombre de columna debe coincidir con foreignKey en index.js
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "priorities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Crear tabla Comments
    await queryInterface.createTable("comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true, // O false si el comentario es obligatorio
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tickets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si se borra el ticket, se borran sus comentarios
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si se borra el usuario, se borran sus comentarios
      },
      comment_date: {
        // Nombre personalizado para createdAt
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    // Crear tabla Changes_history
    await queryInterface.createTable("changes_history", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      previous_status: {
        // FK a Status
        type: Sequelize.INTEGER,
        allowNull: true, // Puede ser NULL para la creación inicial del ticket
        references: {
          model: "status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // No borrar un estado si está en el historial
      },
      new_status: {
        // FK a Status
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "status",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tickets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si se borra el ticket, se borra su historial
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Quién hizo el cambio
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si se borra el usuario, se borra su historial
      },
      change_date: {
        // Nombre personalizado para createdAt
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      // No necesitamos updatedAt aquí
    });
  },

  async down(queryInterface, Sequelize) {
    // Borrar tablas en orden inverso a la creación debido a las FKs
    await queryInterface.dropTable("changes_history");
    await queryInterface.dropTable("comments");
    await queryInterface.dropTable("tickets");
    await queryInterface.dropTable("status");
    await queryInterface.dropTable("priorities");
    await queryInterface.dropTable("categories");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("departments");
  },
};
