import sequelizeInstance from "../config/db.js";

// Importa cada modelo explícitamente con la extensión .js
// ¡ASEGÚRATE DE QUE CADA UNO DE ESTOS ARCHIVOS USE 'export default sequelize.define(...)'!
import User from "./User.js";
import Ticket from "./Ticket.js";
import Category from "./Category.js";
import Department from "./Department.js";
import Priority from "./Priority.js";
import Status from "./Status.js";
import Comment from "./Comment.js";
import ChangeHistory from "./ChangeHistory.js";

// Define todas las relaciones aquí, usando los modelos importados
// (Estos son los mismos que te di antes, asegúrate que las foreignKey coincidan
// con las columnas en tus definiciones de modelo)
User.belongsTo(Department, { foreignKey: "department_id", as: "department" });
Department.hasMany(User, { foreignKey: "department_id", as: "users" });

Ticket.belongsTo(User, {
  foreignKey: "user_id",
  as: "requester",
  onDelete: "SET NULL", // Esto permite mantener los tickets cuando se elimina el usuario
});

User.hasMany(Ticket, {
  foreignKey: "user_id",
  as: "createdTickets",
  onDelete: "SET NULL", // Coherente con la relación belongsTo
});

Ticket.belongsTo(Category, { foreignKey: "category", as: "categoryInfo" });
Category.hasMany(Ticket, { foreignKey: "category", as: "tickets" });

Ticket.belongsTo(Priority, { foreignKey: "priority", as: "priorityInfo" });
Priority.hasMany(Ticket, { foreignKey: "priority", as: "tickets" });

Ticket.belongsTo(Status, { foreignKey: "status", as: "statusInfo" });
Status.hasMany(Ticket, { foreignKey: "status", as: "tickets" });

Comment.belongsTo(Ticket, { foreignKey: "ticket_id", as: "ticket" });
Ticket.hasMany(Comment, { foreignKey: "ticket_id", as: "comments" });

Comment.belongsTo(User, { foreignKey: "user_id", as: "author" }); // Alias más descriptivo
User.hasMany(Comment, { foreignKey: "user_id", as: "commentsMade" });

ChangeHistory.belongsTo(Ticket, { foreignKey: "ticket_id", as: "ticket" });
Ticket.hasMany(ChangeHistory, { foreignKey: "ticket_id", as: "history" }); // Alias más descriptivo

ChangeHistory.belongsTo(User, { foreignKey: "user_id", as: "changedBy" }); // Alias más descriptivo
User.hasMany(ChangeHistory, { foreignKey: "user_id", as: "changesPerformed" });

// Exporta todos los modelos y la instancia de sequelize para que puedan ser usados
// en otras partes de la aplicación (controladores, etc.)
export {
  User,
  Ticket,
  Category,
  Department,
  Priority,
  Status,
  Comment,
  ChangeHistory,
  sequelizeInstance as sequelize, // Exporta la instancia con el nombre estándar 'sequelize'
};
