const { MenuItem } = require("../models");

/**
 * @openapi
 * /api/menu:
 *  get:
 *    tags:
 *     - Menu Items
 *    summary: Get all menu items
 *    description: Retrieve a list of menu items
 *    responses:
 *     200:
 *      description: Menu items retrieved successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/MenuItem'
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
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      order: [
        ["category", "DESC"],
        ["name", "ASC"],
      ],
    });

    res.json({ success: true, data: menuItems });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/menu/{id}:
 *  get:
 *    tags:
 *     - Menu Items
 *    summary: Get one menu item by ID
 *    description: Retrieve a menu item by its ID
 *    parameters:
 *    - in: path
 *      name: id
 *    responses:
 *     200:
 *      description: Menu item retrieved successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           $ref: '#/components/schemas/MenuItem'
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
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    res.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/menu:
 *  post:
 *   tags:
 *    - Menu Items
 *   summary: Create a new menu item
 *   description: Create a new menu item with the provided details
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/MenuItem'
 *   responses:
 *    201:
 *     description: Menu item created successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         data:
 *          $ref: '#/components/schemas/MenuItem'
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
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const newMenuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).json({ success: true, data: newMenuItem });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/menu/{id}:
 *  put:
 *    tags:
 *     - Menu Items
 *    summary: Update a menu item by ID
 *    description: Update the details of a menu item by its ID
 *    parameters:
 *     - in: path
 *       name: id
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          name:
 *           type: string
 *          description:
 *           type: string
 *          price:
 *           type: number
 *          category:
 *           type: string
 *    responses:
 *     200:
 *      description: Menu item updated successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          data:
 *           $ref: '#/components/schemas/MenuItem'
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
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    await menuItem.update({
      name,
      description,
      price,
      category,
    });
    res.json({ success: true, data: menuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @openapi
 * /api/menu/{id}:
 *  delete:
 *    tags:
 *     - Menu Items
 *    summary: Delete a menu item by ID
 *    description: Delete a menu item by its ID
 *    parameters:
 *     - in: path
 *       name: id
 *    responses:
 *     200:
 *      description: Menu item updated successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          success:
 *           type: boolean
 *           example: true
 *          message:
 *           type: string
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
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }
    await menuItem.destroy();
    res.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
