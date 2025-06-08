import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POS from "./pages/POS";
import Kitchen from "./pages/Kitchen";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Suppliers from "./pages/Suppliers";
import Promotions from "./pages/Promotions";
import ShiftManagement from "./pages/ShiftManagement";
import Attendance from "./pages/Attendance";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Waiters from "./pages/Waiters";
import Branches from "./pages/Branches";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/pos" element={
              <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                <POS />
              </ProtectedRoute>
            } />
            
            <Route path="/kitchen" element={
              <ProtectedRoute allowedRoles={['admin', 'kitchen']}>
                <Kitchen />
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/branches" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Branches />
              </ProtectedRoute>
            } />
            
            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Inventory />
              </ProtectedRoute>
            } />
            
            <Route path="/suppliers" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Suppliers />
              </ProtectedRoute>
            } />
            <Route path="/waiters" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Waiters />
              </ProtectedRoute>
            } />
            
            <Route path="/promotions" element={
              <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                <Promotions />
              </ProtectedRoute>
            } />
            
            <Route path="/shifts" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ShiftManagement />
              </ProtectedRoute>
            } />

            <Route path="/customers" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <Customers />
  </ProtectedRoute>
} />
            
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Attendance />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices" element={
              <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                <Invoices />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="/employees" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Employees />
              </ProtectedRoute>
            } />
            
            <Route path="/menu" element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
