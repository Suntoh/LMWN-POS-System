const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

/**
 * @openapi
 * components:
 *   schemas:
 *    MenuItem:
 *     type: object
 *     properties:
 *      id:
 *        type: string
 *        format: uuid
 *        description: Unique identifier for the menu item
 *      name:
 *        type: string
 *        description: Name of the menu item
 *      description:
 *        type: string
 *        description: Description of the menu item
 *      price:
 *        type: number
 *        format: float
 *        description: Price of the menu item
 *      category:
 *        type: string
 *        description: Category of the menu item
 */
const MenuItem = sequelize.define("MenuItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = MenuItem;
