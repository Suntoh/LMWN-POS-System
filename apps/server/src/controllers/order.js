const { Order, Orderitem, MenuItem, OrderItem } = require("../models");
const { sequelize } = require("../db");

/**
 * @openapi
 * /api/orders:
 *  get:
 *   tags:
 *   - Orders
 *   summary: Get all orders
 *   description: Retrieve a list of orders with pagination
 *   responses:
 *    200:
 *     description: Orders retrieved successfully
 *     content:
 *      application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/OrderWithItems'
 *          pagination:
 *           type: object
 *           properties:
 *            total:
 *             type: integer
 *             example: 50
 *            page:
 *             type: integer
 *             example: 1
 *            pages:
 *             type: integer
 *             example: 5
 *    500:
 *      description: Server error
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           success:
 *            type: boolean
 *            example: false
 *           message:
 *            type: string
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const { count, rows: orders } = await Order.findAndCountAll({
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: ["id", "name", "category"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt((page - 1) * limit),
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}:
 *  get:
 *    tags:
 *     - Orders
 *    summary: Get one order by ID
 *    description: Retrieve an order by its ID
 *    parameters:
 *    - in: path
 *      name: id
 *    responses:
 *     200:
 *      description: Order retrieved successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           $ref: '#/components/schemas/OrderWithItems'
 *     500:
 *      description: Server error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
            },
          ],
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//not yet use
const getLatestOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
            },
          ],
        },
      ],
    });
    if (!order) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders:
 *  post:
 *    tags:
 *    - Orders
 *    summary: Create a new order
 *    description: Create a new order with the provided details
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *           tableNumber:
 *            type: integer
 *           items:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/MenuItem'
 *    responses:
 *     201:
 *      description: Order created successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           $ref: '#/components/schemas/OrderWithItems'
 *     500:
 *      description: Server error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 */
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tableNumber, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No item added" });
    }
    const order = await Order.create(
      {
        tableNumber,
        status: "receive",
      },
      { transaction: t },
    );

    let totalPrice = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);

      if (!menuItem) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `MenuItem with id ${item.menuItemId} not found`,
        });
      }

      const subtotal = parseFloat(menuItem.price) * item.quantity;
      totalPrice += subtotal;

      await OrderItem.create(
        {
          orderId: order.id,
          menuItemId: menuItem.id,
          quantity: item.quantity,
          unitPrice: menuItem.price,
          subtotal: subtotal,
        },
        { transaction: t },
      );
    }

    await order.update({ totalPrice }, { transaction: t });

    await t.commit();

    const returnOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              as: "menuItem",
            },
          ],
        },
      ],
    });

    res.status(201).json({ success: true, data: returnOrder });
  } catch (error) {
    await t.rollback();
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}/status:
 *  patch:
 *   tags:
 *    - Orders
 *   summary: Update order status
 *   description: Update the status of an existing order
 *   parameters:
 *    - in: path
 *      name: id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        status:
 *         type: string
 *         description: New status for the order
 *         example: paid
 *   responses:
 *    200:
 *     description: Order status updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Order'
 *    400:
 *      description: Invalid status
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 *    404:
 *      description: Order not found
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 *    500:
 *      description: Server error
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validaStatuses = [
      "receive",
      "preparing",
      "ready",
      "served",
      "cancelled",
      "paid",
    ];

    if (!validaStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await order.update({ status });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}/items:
 *  post:
 *   tags:
 *    - Orders
 *   summary: Add item to order
 *   description: Add a new item to an existing order
 *   parameters:
 *    - in: path
 *      name: id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        menuItemId:
 *         type: string
 *         format: uuid
 *         description: ID of the menu item to add
 *        quantity:
 *         type: integer
 *         description: Quantity of the menu item to add
 *   responses:
 *    200:
 *     description: Item added to order successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/OrderItem'
 *    404:
 *     description: Order or MenuItem not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 *    500:
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 */
const addItemToOrder = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const menuItem = await MenuItem.findByPk(menuItemId);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "MenuItem not found" });
    }
    const subtotal = parseFloat(menuItem.price) * quantity;

    const orderItem = await OrderItem.create({
      orderId: order.id,
      menuItemId: menuItem.id,
      quantity,
      unitPrice: menuItem.price,
      subtotal,
    });

    await order.update({ totalPrice: order.totalPrice + subtotal });

    res.json({ success: true, data: orderItem });
  } catch (error) {
    console.error("Error adding item to order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}/items/{itemId}:
 *  delete:
 *   tags:
 *    - Orders
 *   summary: Remove item from order
 *   description: Remove an item from an existing order
 *   parameters:
 *    - in: path
 *      name: id
 *    - in: path
 *      name: itemId
 *   responses:
 *    200:
 *     description: Item removed from order successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *    404:
 *     description: Order or OrderItem not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 *    500:
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          success:
 *           type: boolean
 *           example: false
 *          message:
 *           type: string
 */
const removeItemFromOrder = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.itemId);
    if (!orderItem) {
      return res
        .status(404)
        .json({ success: false, message: "OrderItem not found" });
    }
    const order = await Order.findByPk(orderItem.orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    await orderItem.destroy();
    await order.update({ totalPrice: order.totalPrice - orderItem.subtotal });

    res.json({
      success: true,
      message: "Item removed from order successfully",
    });
  } catch (error) {
    console.error("Error removing item from order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}:
 *  delete:
 *   tags:
 *    - Orders
 *   summary: Delete an order by ID
 *   description: Delete an order by its ID
 *   parameters:
 *    - in: path
 *      name: id
 *   responses:
 *    200:
 *     description: Order deleted successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *    500:
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    // soft delete
    await order.destroy();
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}/discount:
 *  post:
 *   tags:
 *    - Orders
 *   summary: Apply discount to order
 *   description: Apply a fixed discount amount to an existing order
 *   parameters:
 *    - in: path
 *      name: id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        discount:
 *         type: number
 *         description: Discount amount to apply
 *   responses:
 *    200:
 *     description: Discount applied to order successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Order'
 *    404:
 *     description: Order not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *    500:
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 */
const discountOrder = async (req, res) => {
  try {
    const { discount } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const newTotal = order.totalPrice - discount;
    await order.update({ totalPrice: newTotal, discount });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error applying discount to order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/orders/{id}/discount-percentage:
 *  post:
 *   tags:
 *    - Orders
 *   summary: Apply discount to order in percentage
 *   description: Apply a percentage discount to an existing order
 *   parameters:
 *    - in: path
 *      name: id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        discountPercentage:
 *         type: number
 *         description: Discount percentage to apply
 *   responses:
 *    200:
 *     description: Discount applied to order successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/Order'
 *    404:
 *     description: Order not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *    500:
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 */
const discountPercentageOrder = async (req, res) => {
  try {
    const { discountPercentage } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const discount = (order.totalPrice * discountPercentage) / 100;
    const newTotal = order.totalPrice - discount;
    await order.update({ totalPrice: newTotal, discount });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Error applying percentage discount to order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  addItemToOrder,
  removeItemFromOrder,
  deleteOrder,
  discountOrder,
  discountPercentageOrder,
};
