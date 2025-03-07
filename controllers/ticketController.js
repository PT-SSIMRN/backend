import Ticket from "../models/Ticket.js";

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  try {
    const { message, status, created_by, category, priority } = req.body;

    // Validar campos obligatorios
    if (!message || !status || !created_by || !category || !priority) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const ticket = await Ticket.create({
      message,
      status,
      created_by,
      category,
      priority,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    res.status(500).json({ error: "Error al crear el ticket" });
  }
};

// Obtener todos los tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
};

// Obtener un ticket por ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error al obtener el ticket:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

// Actualizar un ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status, category, priority } = req.body;

    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    // Actualizar solo los campos proporcionados
    await ticket.update({
      message: message || ticket.message,
      status: status || ticket.status,
      category: category || ticket.category,
      priority: priority || ticket.priority,
    });

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error al actualizar el ticket:", error);
    res.status(500).json({ error: "Error al actualizar el ticket" });
  }
};

// Eliminar un ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un número
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    await ticket.destroy();
    res.status(200).json({ message: "Ticket eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el ticket:", error);
    res.status(500).json({ error: "Error al eliminar el ticket" });
  }
};
