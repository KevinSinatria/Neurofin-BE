async function generateExpenseId() {
  const { nanoid } = await import("nanoid");
  const expenseid = nanoid(11);
  return expenseid;
}
const { Expense } = require("../models");
const logger = require("../utils/logger");
const Boom = require("@hapi/boom");

const addExpenseHandler = async (request, h) => {
  const {
    id_user,
    category,
    uangmasuk,
    uangkeluar,
    uangakhir,
    description,
    transaction_date,
  } = request.payload;
  const expenseid = await generateExpenseId();

  try {
    const expense = await Expense.create({
      expenseid,
      id_user,
      category,
      uangmasuk: uangmasuk,
      uangkeluar: uangkeluar,
      uangakhir: uangakhir,
      description,
      transaction_date,
    });

    return h
      .response({
        status: "success",
        message: "Expense berhasil ditambahkan",
        data: { expenseid: expense.expenseid },
      })
      .code(201);
  } catch (error) {
    logger.error("Error adding expense:", error);
    throw Boom.internal("Gagal menambahkan expense");
  }
};

const getExpensesByUserHandler = async (request, h) => {
  const userId = request.auth.id;
  try {
    const expenses = await Expense.findAll({ where: { id_user: userId } });

    if (!expenses || expenses.length === 0) {
      return h
        .response({
          status: "fail",
          message: "Tidak ada data expense ditemukan",
        })
        .code(404);
    }

    return {
      status: "success",
      data: { expenses },
    };
  } catch (error) {
    logger.error("Error retrieving expenses:", error);
    throw Boom.internal("Gagal mengambil data expenses");
  }
};

const getExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    const expense = await Expense.findByPk(expenseid);
    if (!expense) {
      throw Boom.notFound("Expense tidak ditemukan");
    }
    return {
      status: "success",
      data: { expense },
    };
  } catch (error) {
    logger.error("Error retrieving expense by ID:", error);
    if (Boom.isBoom(error)) {
      return h
        .response({
          status: "fail",
          message: error.output.payload.message,
        })
        .code(error.output.statusCode);
    }
    throw Boom.internal("Gagal mengambil data expense");
  }
};

const updateExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  const {
    category,
    uangmasuk,
    uangkeluar,
    uangakhir,
    description,
    transaction_date,
  } = request.payload;

  try {
    const [updated] = await Expense.update(
      {
        category,
        uangmasuk: uangmasuk,
        uangkeluar: uangkeluar,
        uangakhir: uangakhir,
        description,
        transaction_date,
      },
      { where: { expenseid } }
    );

    if (!updated) {
      throw Boom.notFound("Expense gagal diperbarui. Id tidak ditemukan");
    }

    return h.response({
      status: "success",
      message: "Expense berhasil diperbarui",
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    logger.error("Error updating expense:", error);
    throw Boom.internal("Gagal memperbarui expense");
  }
};

const deleteExpenseByIdHandler = async (request, h) => {
  const { expenseid } = request.params;
  try {
    const deleted = await Expense.destroy({ where: { expenseid } });

    if (!deleted) {
      throw Boom.notFound("Expense gagal dihapus. Id tidak ditemukan");
    }

    return h.response({
      status: "success",
      message: "Expense berhasil dihapus",
    });
  } catch (error) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    logger.error("Error deleting expense:", error);
    throw Boom.internal("Gagal menghapus expense");
  }
};

module.exports = {
  addExpenseHandler,
  getExpensesByUserHandler,
  getExpenseByIdHandler,
  updateExpenseByIdHandler,
  deleteExpenseByIdHandler,
};
