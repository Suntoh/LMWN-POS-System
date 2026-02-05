const express = require("express");

const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  addItemToOrder,
  removeItemFromOrder,
  deleteOrder,
  discountOrder,
  discountPercentageOrder,
} = require("../controllers/order");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);
router.post("/:id/items", addItemToOrder);
router.delete("/:id/items/:itemId", removeItemFromOrder);
router.delete("/:id", deleteOrder);
router.post("/:id/discount", discountOrder);
router.post("/:id/discount-percentage", discountPercentageOrder);

module.exports = router;
