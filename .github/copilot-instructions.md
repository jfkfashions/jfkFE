# JFK Biodata Web Application - AI Assistant Instructions

## Project Overview
This is a React-based web application for managing client measurements, orders, and user profiles. The application has distinct user roles (admin and client) with different access levels and functionalities.

## Architecture & Components

### Key Directories
- `/src/components/` - React components organized by feature
- `/src/styles/` - CSS modules for component styling
- `/src/images/` - Static image assets

### Core Components
- **Admin Components**
  - `AdminDashboardAndOrders.js` - Main admin dashboard with metrics and order management
  - `AdminCreateOrder.js`, `AdminUserProfileList.js` - Order and user management
- **Client Components**
  - `ClientHomePage.js` - Client dashboard
  - `MeasurementViewPage.js`, `MeasurementUpdatePage.js` - Measurement management
- **Authentication**
  - `LoginPage.js`, `SignUpPage.js` - User authentication
  - `PrivateRoute.js` - Route protection based on user roles

### Component Organization
1. Feature-based Structure:
   - Admin features in dedicated components
   - Client features separated for clarity
   - Shared components in root level
2. Component Composition Pattern:
```javascript
const AdminDashboard = () => {
  return (
    <PrivateRoute role="admin">
      <MetricsPanel />
      <OrderManagement />
    </PrivateRoute>
  );
};
```

## Development Workflow

### Setup & Running
```bash
npm install  # Install dependencies
npm start    # Start development server on http://localhost:3000
npm test     # Run tests
npm run build # Create production build
```

### State Management
- Uses React's built-in state management with `useState` and `useEffect`
- Local storage for auth persistence (`localStorage.getItem("role")`, `localStorage.getItem("username")`)

### API Integration
- Uses Axios for API calls to backend (default: `http://localhost:8000/api/`)
- Protected routes require authentication token
- Example endpoints:
  - `/api/users/admin/dashboard` - Admin metrics
  - `/api/measurements` - Measurement management

### Common Patterns
1. Authentication Check:
```javascript
useEffect(() => {
  const userRole = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  if (!username && userRole !== "admin") {
    return <Navigate to="/login" />;
  }
}, []);
```

2. Error Handling Pattern:
```javascript
try {
  const response = await axios.get(endpoint);
  setData(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized access
    navigate('/login');
  } else {
    setError('An unexpected error occurred');
    console.error('API Error:', error);
  }
}
```

### Testing Strategy
1. Component Testing Pattern:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('login form submission', () => {
  render(<LoginPage />);
  const usernameInput = screen.getByLabelText(/username/i);
  const submitButton = screen.getByRole('button', { name: /login/i });
  
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.click(submitButton);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

2. Test Organization:
- Place test files next to components (`ComponentName.test.js`)
- Group tests by feature/component
- Use descriptive test names

### API Integration
Key Endpoints:
```javascript
// Authentication
POST /api/users/verify/ - Login authentication
POST /api/users/signup/ - User registration

// Admin Dashboard
GET /api/users/admin/dashboard - Fetch metrics
GET /api/measurements - List measurements
POST /api/orders - Create new order
```

## Important Notes
- The application uses Material-UI (`@mui/material`) for UI components
- CSS modules are used for component-specific styling
- Role-based access control is implemented through `PrivateRoute` component
- Backend API expects to run on port 8000
- Use React Testing Library for component tests
- Follow error handling pattern for consistent error messages
- Implement proper cleanup in useEffect hooks
- Use async/await for API calls