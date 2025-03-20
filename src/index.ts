import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "./prisma";

const app = new Hono();
const prisma = new PrismaClient();

//create customer
app.post("/customers", async (c) => {
  try {
    const { name, email, phoneNumber, address } = await c.req.json();
    const existCustomer = await prisma.customers.findFirst({
      where: {
        OR: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });
    if (existCustomer) {
      return c.json({ message: "Customer already exists" }, 400);
    }
    const customer = await prisma.customers.create({
      data: {
        name,
        email,
        phoneNumber,
        address,
      },
    });
    console.log("Created Successfull");
    return c.json({ message: customer }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to create customer" }, 500);
  }
});

//get all customers
app.get("/customers/:id", async (c) => {
  try {
    const { id } = await c.req.param();
    const customer = await prisma.customers.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!customer) {
      return c.json({ message: "Customer not found" }, 404);
    }
    return c.json({ message: customer }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to get customer" }, 500);
  }
});

//Retrieve all orders placed by this customer
app.get("/customers/:id/orders", async (c) => {
  try {
    const { id } = await c.req.param();
    const orders = await prisma.orders.findMany({
      where: {
        customerId: Number(id),
      },
    });
    if (!orders) {
      return c.json({ message: "No orders found" }, 404);
    }
    return c.json({ message: orders }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to get customer orders" }, 500);
  }
});

//Register a new restaurant
app.post("/restaurants", async (c) => {
  const { name, location } = await c.req.json();
  try {
    const restaurant = await prisma.restaurants.create({
      data: {
        name,
        location,
      },
    });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to create restaurant" }, 500);
  }
});

//Get all available menu items from a restaurant
app.get("/restaurants/:id/menu", async (c) => {
  try {
    const { id } = await c.req.param();
    const menu = await prisma.menuItems.findMany({
      where: {
        restaurantId: Number(id),
      },
    });
    if (!menu) {
      return c.json({ message: "No menu items found" }, 404);
    }
    return c.json({ message: menu }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to get menu items" }, 500);
  }
});

//Add a menu item to a restaurant
app.post("/restaurants/:id/menu", async (c) => {
  try {
    const { restaurantId, name, price, isAvailable } = await c.req.json();
    const menuItem = await prisma.menuItems.create({
      data: {
        restaurantId: Number(restaurantId),
        name,
        price,
        isAvailable,
      },
    });
    return c.json({ message: menuItem }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to add menu item" }, 500);
  }
});

//Update availability or price of a menu item
app.patch("/menu/:id", async (c) => {
  try {
    const { id } = await c.req.param();
    const { name, price, isAvailable } = await c.req.json();
    const menuItem = await prisma.menuItems.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        price,
        isAvailable,
      },
    });
    return c.json({ message: menuItem }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to update menu item" }, 500);
  }
});

//Place an order (includes items and quantities)
app.post("/orders", async (c) => {
  try {
    const { customerId, restaurantId, status, totalPrice, orderTime } =
      await c.req.json();

    // Optional: Validate if customer and restaurant exist (to avoid FK constraint issues)
    const customerExists = await prisma.customers.findUnique({
      where: { id: Number(customerId) },
    });
    const restaurantExists = await prisma.restaurants.findUnique({
      where: { id: Number(restaurantId) },
    });

    if (!customerExists) {
      return c.json({ message: "Customer does not exist" }, 400);
    }

    if (!restaurantExists) {
      return c.json({ message: "Restaurant does not exist" }, 400);
    }

    // Create order
    const order = await prisma.orders.create({
      data: {
        customerId: Number(customerId),
        restaurantId: Number(restaurantId),
        status,
        totalPrice: Number(totalPrice),
        orderTime,
      },
    });

    console.log("Order placed successfully");
    return c.json({ message: order }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to place order" }, 500);
  }
});

//Retrieve details of a specific order
app.get("/orders/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const order = await prisma.orders.findUnique({
      where: { id: Number(id) },
    });
    if (!order) {
      return c.json({ message: "Order not found" }, 404);
    }
    return c.json(order, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to retrieve order" }, 500);
  }
});

// Update the status of an order (e.g., from Placed to Preparing)
app.patch("/orders/:id/status", async (c) => {
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const order = await prisma.orders.update({
      where: { id: Number(id) },
      data: { status },
    });
    return c.json(order, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to update order status" }, 500);
  }
});

//Get total revenue generated by a restaurant
app.get("/restaurants/:id/revenue", async (c) => {
  try {
    const { id } = c.req.param();
    const revenue = await prisma.orders.aggregate({
      where: { restaurantId: Number(id) },
      _sum: { totalPrice: true },
    });
    return c.json(revenue, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to retrieve revenue" }, 500);
  }
});

// Most Ordered Menu Item
app.get("/menu/top-items", async (c) => {
  try {
    const topItems = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,
    });
    const menuItem = topItems[0]
      ? await prisma.menuItems.findUnique({
          where: { id: topItems[0].menuItemId },
        })
      : null;
    return c.json(menuItem);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to retrieve top menu items" }, 500);
  }
});

//Get the top 5 customers based on the number of orders placed
app.get("/customers/top", async (c) => {
  try {
    const topCustomers = await prisma.orders.groupBy({
      by: ["customerId"],
      _count: { customerId: true },
      orderBy: { _count: { customerId: "desc" } },
      take: 5,
    });

    const result = await Promise.all(
      topCustomers.map(async (entry) => {
        const customer = await prisma.customers.findUnique({
          where: { id: entry.customerId },
        });
        return { customer, orderCount: entry._count.customerId };
      })
    );

    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Failed to retrieve top customers" }, 500);
  }
});

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
