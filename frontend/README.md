# CRUD Manager Frontend

A modern React-based CRUD (Create, Read, Update, Delete) interface for managing products and orders with authentication.

## Features

- 🔐 **Authentication**: Secure login/logout with Catalyst Auth
- 📦 **Products Management**: Full CRUD operations for products
- 📋 **Orders Management**: Full CRUD operations for orders
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🚀 **TypeScript**: Type-safe development
- 📱 **Responsive**: Works on desktop and mobile devices

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Catalyst Auth** - Authentication

## Project Structure

```
src/
├── components/
│   ├── products/
│   │   ├── ProductList.tsx
│   │   └── ProductForm.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   └── OrderForm.tsx
│   ├── Navigation.tsx
│   ├── Login.tsx
│   └── Dashboard.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
└── App.tsx
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Catalyst account and project setup

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=your_catalyst_api_base_url
```

3. Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### Authentication

1. **Login**: Users are automatically redirected to the login page if not authenticated
2. **Logout**: Click the logout button in the navigation bar
3. **Session Management**: Authentication state is managed automatically

### Products Management

- **View Products**: Navigate to `/products` to see all products
- **Add Product**: Click "Add Product" button to create a new product
- **Edit Product**: Click "Edit" on any product card
- **Delete Product**: Click "Delete" on any product card (with confirmation)

### Orders Management

- **View Orders**: Navigate to `/orders` to see all orders
- **Add Order**: Click "Add Order" button to create a new order
- **Edit Order**: Click "Edit" on any order card
- **Delete Order**: Click "Delete" on any order card (with confirmation)

## API Integration

The frontend communicates with Catalyst backend functions:

### Products API

- `GET /products` - Get all products
- `GET /products?product_id={id}` - Get specific product
- `POST /products` - Create new product
- `PUT /products?product_id={id}` - Update product
- `DELETE /products?product_id={id}` - Delete product

### Orders API

- `GET /orders` - Get all orders
- `GET /orders?order_id={id}` - Get specific order
- `POST /orders` - Create new order
- `PUT /orders?order_id={id}` - Update order
- `DELETE /orders?order_id={id}` - Delete order

## Data Models

### Product

```typescript
interface Product {
  ROWID?: string;
  name: string;
  description: string;
  price: number;
}
```

### Order

```typescript
interface Order {
  ROWID?: string;
  customer_name: string;
  items: string;
  total_amount: number;
}
```

## Styling

The application uses Tailwind CSS for styling with custom CSS for specific components. The design is responsive and follows modern UI/UX principles.

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Structure

- **Components**: Reusable UI components
- **Contexts**: React context for state management
- **Services**: API communication layer
- **Types**: TypeScript type definitions

## Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy the `build` folder to your hosting platform

3. Ensure your Catalyst functions are deployed and accessible

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check Catalyst Auth configuration
2. **API calls failing**: Verify API base URL and function deployment
3. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

Enable debug logging by setting:

```env
REACT_APP_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
