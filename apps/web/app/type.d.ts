export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "Food" | "Drink" | "Dessert";
}
export interface OrderItem extends MenuItem {
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
export interface Order {
  id: string;
  tableNumber: string;
  status: string;
  totalPrice: number;
  discount: number;
  date: string;
  items: OrderItems[];
}

export interface OrderItems {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  menuItem: MenuItem;
}
