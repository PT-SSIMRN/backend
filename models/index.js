// Importar sequelize y modelos usando ESM
import sequelize from "../config/db.js";

import User from "./User.js";
import Ticket from "./Ticket.js";
import Category from "./Category.js";
import Priority from "./Priority.js";
import ChangeHistory from "./ChangeHistory.js";
import Comment from "./Comment.js";
import BackupRegister from "./BackupRegister.js";

// Definir relaciones
Ticket.belongsTo(User, { foreignKey: "created_by" });
Ticket.belongsTo(Category, { foreignKey: "category" });
Ticket.belongsTo(Priority, { foreignKey: "priority" });

ChangeHistory.belongsTo(Ticket, { foreignKey: "ticket_id" });
ChangeHistory.belongsTo(User, { foreignKey: "user_id" });

Comment.belongsTo(Ticket, { foreignKey: "ticket_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

// Exportar modelos usando ESM
export {
  sequelize,
  User,
  Ticket,
  Category,
  Priority,
  ChangeHistory,
  Comment,
  BackupRegister,
};
