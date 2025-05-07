import {
  Ticket,
  User,
  Status,
  Category,
  Priority,
  Comment,
  ChangeHistory,
} from "../models/index.js";
import sequelize from "../config/db.js";

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { message, category, priority } = req.body;
    const userId = req.user.id;

    const ticket = await Ticket.create(
      {
        message,
        category,
        priority,
        status: 1,
        user_id: userId,
      },
      { transaction: t }
    );

    await t.commit();

    const ticketWithRelations = await Ticket.findByPk(ticket.id, {
      include: [
        { model: User, as: "requester" },
        { model: Status, as: "statusInfo" },
        { model: Category, as: "categoryInfo" },
        { model: Priority, as: "priorityInfo" },
      ],
    });

    res.status(201).json(ticketWithRelations);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear ticket:", error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Obtener todos los tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "username", "department_id", "isadmin"],
        },
        { model: Status, as: "statusInfo" },
        { model: Category, as: "categoryInfo" },
        { model: Priority, as: "priorityInfo" },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "department_id", "isadmin"],
            },
          ],
          order: [["comment_date", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};

// Obtener un ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "username", "department_id", "isadmin"],
        },
        { model: Status, as: "statusInfo" },
        { model: Category, as: "categoryInfo" },
        { model: Priority, as: "priorityInfo" },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "department_id", "isadmin"],
            },
          ],
          order: [["comment_date", "DESC"]],
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

// Actualizar un ticket
export const updateTicket = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { status } = req.body;
    const ticketId = req.params.id;

    // Validar permisos
    if (!req.user.isadmin) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para actualizar tickets" });
    }

    // Validar campos permitidos
    const allowedFields = ["status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No hay campos válidos para actualizar" });
    }

    // Actualizar el ticket
    await Ticket.update(updateData, {
      where: { id: ticketId },
      transaction: t,
    });

    await t.commit();

    // Obtener el ticket actualizado con todas sus relaciones
    const updatedTicket = await Ticket.findByPk(ticketId, {
      include: [
        { model: User, as: "requester" },
        { model: Status, as: "statusInfo" },
        { model: Category, as: "categoryInfo" },
        { model: Priority, as: "priorityInfo" },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "department_id", "isadmin"],
            },
          ],
          order: [["comment_date", "DESC"]],
        },
      ],
    });

    res.json(updatedTicket);
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar ticket:", error);
    res.status(500).json({ error: "Error al actualizar el ticket" });
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
    const priorities = await Priority.findAll();
    res.json(priorities);
  } catch (error) {
    console.error("Error al obtener prioridades:", error);
    res.status(500).json({ error: "Error al obtener las prioridades" });
  }
};

// Crear una nueva prioridad
export const createPriority = async (req, res) => {
  try {
    const { name } = req.body;
    const newPriority = await Priority.create({ name });
    res.status(201).json(newPriority);
  } catch (error) {
    console.error("Error al crear prioridad:", error);
    res.status(500).json({ error: "Error al crear la prioridad" });
  }
};

// Actualizar una prioridad existente
export const updatePriority = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const priority = await Priority.findByPk(id);
    if (!priority)
      return res.status(404).json({ error: "Prioridad no encontrada" });

    priority.name = name || priority.name;
    await priority.save();

    res.json(priority);
  } catch (error) {
    console.error("Error al actualizar prioridad:", error);
    res.status(500).json({ error: "Error al actualizar la prioridad" });
  }
};

// Eliminar una prioridad
export const deletePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const priority = await Priority.findByPk(id);
    if (!priority)
      return res.status(404).json({ error: "Prioridad no encontrada" });

    await priority.destroy();
    res.json({ message: "Prioridad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar prioridad:", error);
    res.status(500).json({ error: "Error al eliminar la prioridad" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    category.name = name || category.name;
    await category.save();

    res.json(category);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    await category.destroy();
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};

// Agregar un comentario a un ticket
export const addComment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { comment } = req.body;
    const ticketId = req.params.id;
    const userId = req.user.id;

    const newComment = await Comment.create(
      {
        comment,
        ticket_id: ticketId,
        user_id: userId,
        comment_date: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    const commentWithAuthor = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "department_id", "isadmin"],
        },
      ],
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    await t.rollback();
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ error: "Error al agregar el comentario" });
  }
};

export const getStatus = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.json(statuses);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: "Error al obtener los estados" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await Ticket.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: "requester",
          attributes: ["id", "username", "department_id", "isadmin"],
        },
        { model: Status, as: "statusInfo" },
        { model: Category, as: "categoryInfo" },
        { model: Priority, as: "priorityInfo" },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "username", "department_id", "isadmin"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener mis tickets:", error);
    res.status(500).json({ error: "Error al obtener mis tickets" });
  }
};