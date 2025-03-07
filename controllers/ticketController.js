import Ticket from "../models/Ticket.js";

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  const { message, category, priority } = req.body;
  const userId = req.user.id; // Usamos la ID del usuario autenticado

  try {
    const newTicket = await Ticket.create({
      message,
      created_by: userId, // Guardamos la ID del usuario como created_by
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
export const getTickets = async (_, res) => {
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
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error al obtener el ticket:", error);
    res.status(500).json({ error: "Error al obtener el ticket" });
  }
};

// Actualizar un ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });

    await ticket.update(req.body);
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error al actualizar el ticket:", error);
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
