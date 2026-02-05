const { MenuItem } = require("../models");

const defaultMenuItems = [
  {
    name: "Pad Thai",
    description:
      "Stir-fried rice noodles with shrimp, tofu, egg, and tamarind sauce",
    price: 100,
    category: "Food",
  },
  {
    name: "Fried Rice",
    description: "Pork fried rice with egg, and vegetables",
    price: 50,
    category: "Food",
  },
  {
    name: "Khao Man Gai",
    description:
      "Hainanese chicken rice served with ginger sauce and clear chicken soup",
    price: 60,
    category: "Food",
  },
  {
    name: "Chicken Kapao Rice",
    description: "Wok-fried rice with chicken, Thai basil, and chili",
    price: 70,
    category: "Food",
  },
  {
    name: "Spaghetti Carbonara",
    description:
      "Thai style pasta with creamy sauce, pancetta, and Parmesan cheese",
    price: 80,
    category: "Food",
  },
  {
    name: "Steamed Jasmine Rice",
    description: "Fragrant Thai jasmine rice",
    price: 10,
    category: "Food",
  },
  {
    name: "Sticky Rice",
    description: "Traditional Thai glutinous rice",
    price: 10,
    category: "Food",
  },
  {
    name: "Thai Iced Tea",
    description: "Sweet Thai tea with condensed milk over ice",
    price: 45,
    category: "Drink",
  },
  {
    name: "Coconut Juice",
    description: "Fresh young coconut water",
    price: 80,
    category: "Drink",
  },
  {
    name: "Butterfly Pea Lemonade",
    description: "Refreshing lemonade infused with butterfly pea flower",
    price: 40,
    category: "Drink",
  },
  {
    name: "Mango Sticky Rice",
    description: "Sweet sticky rice with fresh mango and coconut cream",
    price: 80,
    category: "Dessert",
  },
  {
    name: "Coconut Ice Cream",
    description: "Homemade coconut ice cream with roasted peanuts",
    price: 30,
    category: "Dessert",
  },
  {
    name: "Bua Loy",
    description:
      "Thai dessert of colorful rice flour dumplings in sweet coconut milk",
    price: 40,
    category: "Dessert",
  },
];

const seedMenu = async (options = {}) => {
  const { force = false } = options;

  try {
    const existingCount = await MenuItem.count();

    if (existingCount > 0 && !force) {
      console.log(`Menu already has ${existingCount} items. Skipping seed.`);
      return { seeded: false, count: existingCount };
    }
    if (force) {
      await MenuItem.destroy({ where: {} });
      console.log("Existing menu items cleared due to force option.");
    }
    const items = await MenuItem.bulkCreate(defaultMenuItems);
    console.log(`Seeded ${items.length} menu items.`);

    return { seeded: true, count: items.length };
  } catch (error) {
    console.error("Error seeding menu:", error.message);
    throw error;
  }
};

module.exports = { seedMenu, defaultMenuItems };
