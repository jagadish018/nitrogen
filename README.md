# Nitrogen

This project is  implemented for a **food ordering platform** that supports multiple restaurants. This system provides a relational database schema and implements REST API endpoints to manage customers, restaurants, menu items, and orders.

## Table of Contents

- [Database Schema](#database-schema)
  - [1. Customers](#1-customers)
  - [2. Restaurants](#2-restaurants)
  - [3. Menu Items](#3-menu-items)
  - [4. Orders](#4-orders)
  - [5. Order Items](#5-order-items-join-table)
- [API Endpoints](#api-endpoints)
  - [1. Customers](#1-customers-1)
  - [2. Restaurants](#2-restaurants-1)
  - [3. Menu Items](#3-menu-items-1)
  - [4. Orders](#4-orders-1)
  - [5. Reports & Insights](#5-reports--insights)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Database Schema

The database schema consists of the following tables:

### 1. Customers

- **`id`**: Primary Key
- **`name`**: String (Required)
- **`email`**: String (Unique, Required)
- **`phoneNumber`**: String (Unique, Required)
- **`address`**: String (Required)

### 2. Restaurants

- **`id`**: Primary Key
- **`name`**: String (Unique, Required)
- **`location`**: String (Required)

### 3. Menu Items

- **`id`**: Primary Key
- **`restaurantId`**: Foreign Key → Restaurants.id (Required)
- **`name`**: String (Required)
- **`price`**: Decimal (Required)
- **`isAvailable`**: Boolean (Default: TRUE)

### 4. Orders

- **`id`**: Primary Key
- **`customerId`**: Foreign Key → Customers.id (Required)
- **`restaurantId`**: Foreign Key → Restaurants.id (Required)
- **`status`**: Enum('Placed', 'Preparing', 'Completed', 'Cancelled') (Default: 'Placed')
- **`totalPrice`**: Decimal (Required)
- **`orderTime`**: Timestamp (Default: CURRENT_TIMESTAMP)

### 5. Order Items (Join Table)

- **`id`**: Primary Key
- **`orderId`**: Foreign Key → Orders.id (Required)
- **`menuItemId`**: Foreign Key → Menu Items.id (Required)
- **`quantity`**: Integer (Required)

## API Endpoints

The system provides the following REST API endpoints:

### 1. Customers

- `POST /customers`: Register a new customer
- `GET /customers/{id}`: Retrieve details of a customer
- `GET /customers/{id}/orders`: Retrieve all orders placed by this customer

### 2. Restaurants

- `POST /restaurants`: Register a new restaurant
- `GET /restaurants/{id}/menu`: Get all available menu items from a restaurant

### 3. Menu Items

- `POST /restaurants/{id}/menu`: Add a menu item to a restaurant
- `PATCH /menu/{id}`: Update availability or price of a menu item

### 4. Orders

- `POST /orders`: Place an order (includes items and quantities)
- `GET /orders/{id}`: Retrieve details of a specific order
- `PATCH /orders/{id}/status`: Update the status of an order (e.g., from 'Placed' to 'Preparing')

### 5. Reports & Insights

- `GET /restaurants/{id}/revenue`: Get total revenue generated by a restaurant
- `GET /menu/top-items`: Retrieve the most ordered menu item across all restaurants
- `GET /customers/top`: Get the top 5 customers based on the number of orders placed

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Neon.tech](https://neon.tech/) (Managed PostgreSQL database)
- [Prisma](https://www.prisma.io/) (Database ORM)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mahesh5726/nitrogen.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd nitrogen
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up the database**:
   - Create a database on [Neon.tech](https://neon.tech/).
   - Update the database connection URL in `.env`:
     ```env
     DATABASE_URL="your_neon_database_url"
     ```
   - Run the Prisma migration to set up the database schema:
     ```bash
     npx prisma migrate dev --name "PROVIDE_SUITABLE_MIGRATION_NAME"
     ```

5. **Start the server**:
   ```bash
   npm run dev
   ```
   The server should now be running at `http://localhost:3000`.

## Technologies Used
- **Backend**: Node.js with Hono
- **Database ORM**: Prisma
- **Database**: Neon.tech (Managed PostgreSQL)
- **Language**: TypeScript
   ```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.
