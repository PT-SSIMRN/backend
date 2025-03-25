import sequelize from "../config/db.js";
import User from "./User.js";
import Ticket from "./Ticket.js";
import Category from "./Category.js";
import Department from "./Department.js";
import Priority from "./Priority.js";
import Status from "./Status.js";
import Comment from "./Comment.js";
import ChangeHistory from "./ChangeHistory.js";

// --- Definición de Relaciones ---

// Department -> User (1:N)  Un departamento tiene muchos usuarios.
Department.hasMany(User, { foreignKey: "department_id", onDelete: "RESTRICT" }); //o SET NULL, depende de tu logica.  RESTRICT evita borrar un departamento si tiene usuarios.
User.belongsTo(Department, { foreignKey: "department_id" });

// User -> Ticket (1:N) Un usuario puede tener muchos tickets
User.hasMany(Ticket, { foreignKey: "user_id", onDelete: "CASCADE" }); //Si borras un usuario, se borran sus tickets.
Ticket.belongsTo(User, { foreignKey: "user_id" });

// Category -> Ticket (1:N) Una categoría puede tener muchos tickets.
Category.hasMany(Ticket, { foreignKey: "category", onDelete: "RESTRICT" }); // Evita borrar categoría si tiene tickets
Ticket.belongsTo(Category, { foreignKey: "category" });

// Priority -> Ticket (1:N) Una prioridad puede tener muchos tickets.
Priority.hasMany(Ticket, { foreignKey: "priority", onDelete: "RESTRICT" }); // Evita borrar prioridad si tiene tickets
Ticket.belongsTo(Priority, { foreignKey: "priority" });

// Status -> Ticket (1:N) Un estado puede tener muchos tickets
Status.hasMany(Ticket, { foreignKey: "status", onDelete: "RESTRICT" }); //Evita borrar un estado si tiene tickets
Ticket.belongsTo(Status, { foreignKey: "status" });

// User -> Comment (1:N)  Un usuario puede hacer muchos comentarios.
User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" }); // Si se borra el usuario, se borran sus comentarios.
Comment.belongsTo(User, { foreignKey: "user_id" });

// Ticket -> Comment (1:N) Un ticket puede tener muchos comentarios.
Ticket.hasMany(Comment, { foreignKey: "ticket_id", onDelete: "CASCADE" }); // Si se borra el ticket, se borran sus comentarios
Comment.belongsTo(Ticket, { foreignKey: "ticket_id" });

// User -> ChangeHistory (1:N) Un usuario puede tener muchos cambios en el historial.
User.hasMany(ChangeHistory, { foreignKey: "user_id", onDelete: "CASCADE" }); //Si se borra el usuario, se borra su historial
ChangeHistory.belongsTo(User, { foreignKey: "user_id" });

// Ticket -> ChangeHistory (1:N) Un ticket puede tener muchos cambios en el historial.
Ticket.hasMany(ChangeHistory, { foreignKey: "ticket_id", onDelete: "CASCADE" }); // Si se borra el ticket, se borra su historial
ChangeHistory.belongsTo(Ticket, { foreignKey: "ticket_id" });

ChangeHistory.belongsTo(Status, {
  foreignKey: "previous_status",
  as: "previousStatus",
}); //Relación con previous_status
ChangeHistory.belongsTo(Status, { foreignKey: "new_status", as: "newStatus" }); //Relación con new_status
Status.hasMany(ChangeHistory, {
  foreignKey: "previous_status",
  as: "previousStatus",
});
Status.hasMany(ChangeHistory, { foreignKey: "new_status", as: "newStatus" });

export {
  User,
  Ticket,
  Category,
  Department,
  Priority,
  Status,
  Comment,
  ChangeHistory,
  sequelize,
};
