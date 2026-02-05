const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

/**
 * @openapi
 * components:
 *   schemas:
 *    OrderItem:
 *     type: object
 *     properties:
 *      id:
 *        type: string
 *        format: uuid
 *        description: Unique identifier for the order item
 *      quantity:
 *        type: integer
 *        description: Quantity of the order item
 *      unitPrice:
 *        type: number
 *        format: float
 *        description: Unit price of the order item
 *      subtotal:
 *        type: number
 *        format: float
 *        description: Subtotal price of the order item
 */
const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = OrderItem;
