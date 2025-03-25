import {
  Ticket,
  User,
  Status,
  Category,
  Priority,
  Comment,
  ChangeHistory,
  sequelize,
} from "../models/index.js";

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  const { message, category, priority } = req.body;
  const userId = req.user.id; // Usamos la ID del usuario autenticado

  // --- LOGS DE DEPURACIÓN ---
  console.log("--- Intentando crear ticket ---");
  console.log("Usuario ID (del token):", userId);
  console.log("Datos recibidos (req.body):", req.body);
  console.log("Valores a usar en Ticket.create:");
  console.log("  message:", message);
  console.log("  user_id:", userId); // Verifica que este sea el nombre correcto de la columna
  console.log("  category (ID):", category);
  console.log("  priority (ID):", priority);
  console.log("-----------------------------");

  try {
    const newTicket = await Ticket.create({
      message,
      user_id: userId, // Guardamos la ID del usuario como created_by
      category,
      priority,
    });
    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Obtener todos los tickets
export const getTickets = async (req, res) => {
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isadmin;
  const { userId: queryUserId } = req.query;

  let whereClause = {};
  if (isAdmin) {
    if (queryUserId) whereClause.user_id = queryUserId;
  } else {
    whereClause.user_id = loggedInUserId;
  }

  try {
    const tickets = await Ticket.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "username"] /*, as: 'creator' */,
        },
        { model: Status, attributes: ["id", "name"] /*, as: 'statusInfo' */ },
        {
          model: Category,
          attributes: ["id", "name"] /*, as: 'categoryInfo' */,
        },
        {
          model: Priority,
          attributes: ["id", "name"] /*, as: 'priorityInfo' */,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(tickets || []);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    res.status(500).json({ error: "Error interno al obtener los tickets." });
  }
};

// Obtener un ticket por ID
export const getTicketById = async (req, res) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isadmin;

  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "username"] /*, as: 'creator'*/ },
        { model: Status, attributes: ["id", "name"] /*, as: 'statusInfo'*/ },
        {
          model: Category,
          attributes: ["id", "name"] /*, as: 'categoryInfo'*/,
        },
        {
          model: Priority,
          attributes: ["id", "name"] /*, as: 'priorityInfo'*/,
        },
        {
          model: Comment,
          // as: 'comments', // Si usaste alias
          include: [
            { model: User, attributes: ["id", "username"] /*, as: 'author'*/ },
          ],
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }

    // Autorización: ¿Puede este usuario ver este ticket?
    if (!isAdmin && ticket.user_id !== loggedInUserId) {
      return res
        .status(403)
        .json({ error: "Acceso denegado. No puedes ver este ticket." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(`Error al obtener el ticket ${id}:`, error);
    res.status(500).json({ error: "Error interno al obtener el ticket." });
  }
};

// Actualizar un ticket
export const updateTicket = async (req, res) => {
  const { id } = req.params; // ID del ticket a actualizar
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isadmin;

  // 1. Verificar si el usuario es administrador
  if (!isAdmin) {
    return res.status(403).json({
      error: "Acceso denegado. Solo administradores pueden actualizar tickets.",
    });
  }

  // 2. Definir qué campos puede actualizar un admin
  const allowedUpdates = ["message", "status", "category", "priority"]; // Ajusta según necesites
  const updateData = {};

  // Filtrar req.body para solo incluir campos permitidos
  for (const key of allowedUpdates) {
    // Comprobar si la clave existe en el body y no es undefined
    // También es buena idea convertir IDs a número si vienen como string
    if (req.body[key] !== undefined) {
      if (["status", "category", "priority"].includes(key)) {
        // Asegurarse que los IDs sean números enteros
        const intValue = parseInt(req.body[key], 10);
        if (!isNaN(intValue)) {
          updateData[key] = intValue;
        } else {
          // Manejar error si no es un número válido para IDs
          return res.status(400).json({
            error: `Valor inválido para el campo '${key}'. Se esperaba un número.`,
          });
        }
      } else {
        updateData[key] = req.body[key]; // Para 'message' u otros campos string/text
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: "No se proporcionaron datos válidos para actualizar." });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      // 3. Buscar el ticket existente dentro de la transacción
      const ticket = await Ticket.findByPk(id, { transaction: t });
      if (!ticket) {
        throw new Error("TicketNotFound");
      }

      // 4. Registrar CADA cambio en el historial ANTES de actualizar
      const historyPromises = []; // Para guardar las promesas de creación de historial
      for (const key in updateData) {
        // Compara el valor nuevo con el valor actual del ticket
        // Convierte a String para comparación/almacenamiento genérico (o maneja tipos si prefieres)
        const previousValueStr = String(ticket[key] ?? ""); // Valor actual o '' si es null/undefined
        const newValueStr = String(updateData[key] ?? ""); // Nuevo valor o ''

        if (previousValueStr !== newValueStr) {
          // Si los valores son diferentes, crea una entrada en el historial
          historyPromises.push(
            ChangeHistory.create(
              {
                ticket_id: ticket.id,
                user_id: loggedInUserId, // El admin que hizo el cambio
                field_changed: key, // El nombre del campo que cambió
                previous_value: ticket[key], // Guardar el valor original (puede ser null)
                new_value: updateData[key], // Guardar el nuevo valor
              },
              { transaction: t }
            )
          );
        }
      }
      // Espera a que todas las inserciones de historial se completen
      await Promise.all(historyPromises);

      // 5. Actualizar el ticket con los datos permitidos
      await ticket.update(updateData, { transaction: t });

      // 6. Volver a buscar el ticket actualizado CON includes para devolverlo completo
      const updatedTicketWithIncludes = await Ticket.findByPk(id, {
        include: [
          { model: User, attributes: ["id", "username"] },
          { model: Status, attributes: ["id", "name"] },
          { model: Category, attributes: ["id", "name"] },
          { model: Priority, attributes: ["id", "name"] },
          {
            model: Comment,
            include: [{ model: User, attributes: ["id", "username"] }],
            order: [["createdAt", "ASC"]],
          },
        ],
        transaction: t,
      });

      return updatedTicketWithIncludes;
    }); // Fin de la transacción

    res.status(200).json(result);
  } catch (error) {
    console.error(`Error al actualizar el ticket ${id}:`, error);
    if (error.message === "TicketNotFound") {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({
        error: "Error de validación o referencia al actualizar.",
        details: error.message,
      });
    }
    res.status(500).json({ error: "Error interno al actualizar el ticket." });
  }
};

// Eliminar un ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });

    await ticket.destroy();
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el ticket:", error);
    res.status(500).json({ error: "Error al eliminar el ticket" });
  }
};

export const getPriorities = async (req, res) => {
  try {
    // CORRECTO: Llama a findAll sin argumentos para obtener todos
    const priorities = await Priority.findAll();

    // CORRECTO: Verifica si el array está vacío
    if (!priorities || priorities.length === 0) {
      // Puedes devolver 200 con array vacío o 404, depende de tu preferencia
      return res.status(404).json({ error: "No se encontraron prioridades" });
      // return res.status(200).json([]); // Devolver array vacío es común
    }

    res.status(200).json(priorities);
  } catch (error) {
    console.error("Error al obtener prioridades:", error);
    res.status(500).json({ error: "Error interno al obtener prioridades" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: "No se encontraron categorías" });
      //return res.status(200).json([]);
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error interno al obtener las categorías" });
  }
};
