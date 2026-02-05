const Order = require("./order");
const MenuItem = require("./menuItem");
const OrderItem = require("./orderItem");

/**
 * @openapi
 * components:
 *  schemas:
 *   OrderWithItems:
 *     allOf:
 *       - $ref: '#/components/schemas/Order'
 *       - type: object
 *         properties:
 *           items:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/OrderItemWithMenu'
 */
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

/**
 * @openapi
 * components:
 *  schemas:
 *   OrderItemWithMenu:
 *     allOf:
 *       - $ref: '#/components/schemas/OrderItem'
 *       - type: object
 *         properties:
 *           menuItem:
 *              $ref: '#/components/schemas/MenuItem'
 */
MenuItem.hasMany(OrderItem, {
  foreignKey: "menuItemId",
  as: "orderItems",
});

OrderItem.belongsTo(MenuItem, {
  foreignKey: "menuItemId",
  as: "menuItem",
});

module.exports = {
  Order,
  MenuItem,
  OrderItem,
};
