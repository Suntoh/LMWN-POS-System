const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

/**
 * @openapi
 * components:
 *   schemas:
 *    Order:
 *     type: object
 *     properties:
 *      id:
 *        type: string
 *        format: uuid
 *        description: Unique identifier for the order
 *      tableNumber:
 *        type: integer
 *        description: Table number associated with the order
 *      status:
 *        type: string
 *        description: Status of the order
 *      totalPrice:
 *        type: number
 *        format: float
 *        description: Total price of the order
 *      discount:
 *        type: number
 *        description: Discount applied to the order
 */
const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "receive",
        "preparing",
        "ready",
        "served",
        "cancelled",
        "paid",
      ),
      defaultValue: "receive",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    paranoid: true, // Enable soft deletes
  },
);

module.exports = Order;
