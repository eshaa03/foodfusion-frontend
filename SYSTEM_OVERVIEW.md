# FoodFusion - Complete Food Delivery Platform

## Overview
FoodFusion is a modern, responsive food delivery application with comprehensive admin capabilities, AI-powered features, and health-conscious diet mode.

## User Roles & Credentials

### 1. Regular User
- **Username:** `user`
- **Password:** `user123`
- **Access:** Food ordering, customization, cart, AI chatbot

### 2. Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Access:** 
  - Dashboard with statistics
  - Order management
  - Food item management
  - Customer management
  - Delivery tracking
  - Analytics

### 3. Super Admin
- **Username:** `superadmin`
- **Password:** `super123`
- **Access:** All Admin features plus:
  - Admin user management
  - Revenue management
  - System settings
  - Full platform control

## Key Features

### User Application
1. **Diet Mode Toggle**
   - Normal Mode (Red/Yellow theme)
   - Healthy Mode (Green theme)
   - Affects menu filtering, recommendations, and UI

2. **Food Customization**
   - Add/remove ingredients
   - Portion size selection (Small, Regular, Large)
   - Quantity adjustment
   - Real-time price calculation
   - Budget awareness alerts

3. **Smart Features**
   - Budget tracker ($10-$100 range)
   - Diet filters (Vegetarian, Vegan, Keto, Gluten-Free, Low Calorie, Low Sugar)
   - AI-powered recommendations based on preferences and budget
   - Search functionality
   - Category filtering

4. **AI Chatbot**
   - Context-aware responses based on diet mode
   - Food suggestions
   - Customer assistance
   - Interactive conversation interface

5. **Cart & Checkout**
   - Floating cart button with item count
   - Total price display
   - Customization tracking

### Admin Dashboard
1. **Dashboard Overview**
   - Key metrics (Total Orders, Revenue, Customers, Pending Orders)
   - Trend indicators
   - Quick action buttons
   - Recent activity feed

2. **Order Management**
   - Real-time order tracking
   - Status updates (Pending → Preparing → Delivering → Completed)
   - Search and filter orders
   - Customer information
   - Delivery address tracking

3. **Food Management**
   - Add/Edit/Delete menu items
   - Stock management
   - Availability toggle
   - Category organization
   - Price management

4. **Analytics**
   - Weekly revenue charts
   - Daily orders visualization
   - Sales by category (pie chart)
   - Top-selling items table
   - Performance trends

### Super Admin Dashboard
All Admin features plus:

1. **Admin Management**
   - Create/Edit/Delete admin users
   - Role assignment (Admin vs Super Admin)
   - Status management (Active/Inactive)
   - Last login tracking

2. **Advanced Features**
   - Revenue analytics
   - System-wide settings
   - Platform configuration

## Technical Stack
- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4 with custom theme
- **Animations:** Motion/React (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Font:** Poppins (Google Fonts)

## File Structure
```
/src/app/
  ├── App.tsx (Main entry point with authentication)
  ├── UserApp.tsx (Customer-facing application)
  └── components/
      ├── Header.tsx
      ├── FoodCard.tsx
      ├── CustomizationPanel.tsx
      ├── CartButton.tsx
      ├── AIRecommendations.tsx
      ├── Chatbot.tsx
      ├── DietFilters.tsx
      └── admin/
          ├── Login.tsx
          ├── AdminDashboard.tsx
          ├── AdminSidebar.tsx
          ├── DashboardStats.tsx
          ├── OrderManagement.tsx
          ├── FoodManagement.tsx
          ├── Analytics.tsx
          └── AdminManagement.tsx
```

## Color Scheme
### Normal Mode
- Primary: #E23744 (Red)
- Secondary: #FFC72C (Yellow)
- Accent: #FFA500 (Orange)
- Background: #FFF8F0 (Warm cream)

### Healthy Mode
- Primary: #4CAF50 (Green)
- Secondary: #8BC34A (Light green)
- Accent: #81C784 (Pale green)
- Background: #F1F8E9 (Light green tint)

## Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt from 2 columns (mobile) to 4 columns (desktop)
- Touch-friendly interface elements
- Optimized modals and panels for all screen sizes

## State Management
- React hooks (useState) for local state
- Props drilling for component communication
- Mock data for demonstration
- Ready for backend integration (API endpoints commented)

## Future Enhancements
1. Real backend integration with database
2. Payment gateway integration
3. Real-time order tracking with maps
4. Push notifications
5. User authentication with JWT
6. Advanced analytics with more metrics
7. Multi-restaurant support
8. Rating and review system
9. Loyalty program
10. Social media integration

## Getting Started
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Login with one of the provided credentials
4. Explore the application based on your role

## Notes
- All data is currently mocked for demonstration
- Admin features are fully functional with local state
- Images are sourced from Unsplash
- Designed for production-ready MERN stack deployment
