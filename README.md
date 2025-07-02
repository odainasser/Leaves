# Leaves Management System

A comprehensive leave management system built with .NET Core Web API backend and Next.js frontend, following Clean Architecture principles.

## Default Seeder Accounts

The application automatically creates default user accounts when it starts for the first time. These accounts are useful for testing and initial setup:

### Administrator Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin
- **Full Name**: Administrator

### Employee Account
- **Email**: `employee@example.com`
- **Password**: `employee123`
- **Role**: Employee
- **Full Name**: John Employee

⚠️ **Security Note**: These are default development credentials. In production environments, change these passwords immediately after first login and consider implementing proper user registration workflows.

## Project Structure

```
Leaves
├── Leaves.Domain                 # Domain Layer
│   ├── Entities                  # Entities (User, LeaveRequest)
│   ├── Enums                     # Enums (UserRole, LeaveStatus, UserStatus)
│   └── Interfaces                # Domain Interfaces (Repositories)
│
├── Leaves.Application            # Application Layer
│   ├── DTOs                      # Data Transfer Objects (Requests/Responses)
│   │   ├── Users
│   │   └── Leaves
│   ├── Interfaces                # Service Interfaces
│   ├── Services                  # Business Logic Implementations
│   └── Validators                # FluentValidation Validators
│
├── Leaves.Infrastructure         # Infrastructure Layer
│   ├── Data                      # DbContext and Migrations
│   ├── Authentication            # JWT Token Generator
│   ├── Repositories              # Repository Implementations
│   ├── SeedData                  # Database Seeder
│   └── Settings                  # Configuration Models (e.g., JwtSettings)
│
├── Leaves.Web                    # API / Web Layer
│   ├── Controllers                # API Controllers
│   ├── Properties                 # launchSettings.json
│   ├── appsettings.json           # App Configuration
│   ├── Program.cs                 # Main Entry Point (DI, CORS, Auth, Swagger)
│   └── frontend                   # Next.js Frontend App
│       ├── app                    # App Router (Pages/Routes)
│       ├── components             # React Components
│       ├── hooks                  # React Hooks (e.g., Auth Hook)
│       ├── middleware.ts          # Role-based Middleware Protection
│       ├── public                 # Public Assets
│       ├── styles                 # Tailwind / CSS Files
│       ├── utils                  # Helpers (API Utils, Auth, etc.)
│       ├── .env.local             # Environment Variables
│       ├── next.config.js         # Next.js Config
│       └── package.json            # Frontend Dependencies
│
├── Leaves.sln                    # Solution File
└── README.md                     # Documentation
```

## Architecture Overview

- **Domain Layer**: Contains core business entities, enums, and domain interfaces
- **Application Layer**: Business logic, DTOs, services, and validation rules
- **Infrastructure Layer**: Data access, authentication, repositories, and external dependencies
- **Web Layer**: API controllers and Next.js frontend application

## Fun Facts 🎉

This project was entirely built on **macOS** using:
- **VS Code** as the primary IDE
- **Docker** for SQL Server database containerization
- **.NET CLI** commands for project scaffolding, migrations, and running the application
- **Terminal/Command Line** for all development workflows

No Visual Studio required - just the power of cross-platform development! 🚀

## Installation Guide

### Prerequisites
- .NET 8.0 SDK or later
- Node.js 18+ and npm/yarn
- SQL Server or SQL Server Express
- Visual Studio 2022 or VS Code

### Backend Setup (.NET Web API)

1. **Clone the repository**
   ```bash
   git clone https://github.com/odainasser/Leaves
   cd Leaves
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   - Open `Leaves.Web/appsettings.json`
   - Update the `ConnectionStrings:DefaultConnection` with your SQL Server details

4. **Run database migrations**
   ```bash
   cd Leaves.Web
   dotnet ef database update
   ```

5. **Run the backend API**
   ```bash
   dotnet run
   ```
   - API will be available at `http://localhost:5252`
   - Swagger documentation at `http://localhost:5252/swagger/index.html`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd Leaves.Web/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local` (if exists)
   - Or create `.env.local` with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5252/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   - Frontend will be available at `http://localhost:3000`

### Development Workflow

1. Start the backend API first (`dotnet run` from Leaves.Web)
   - Backend runs on `http://localhost:5252`
2. Start the frontend (`npm run dev` from Leaves.Web/frontend)
   - Frontend runs on `http://localhost:3000`
3. Access the application at `http://localhost:3000`
4. **Login with default accounts** (see Default Seeder Accounts section above)

### Building for Production

**Backend:**
```bash
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd Leaves.Web/frontend
npm run build
npm start
```
