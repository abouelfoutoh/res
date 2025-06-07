import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Calculator, 
  ChefHat, 
  Package, 
  Warehouse, 
  BarChart3, 
  Users, 
  Menu as MenuIcon, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Utensils,
  Truck,
  Tag,
  Clock,
  UserCheck,
  Receipt
} from 'lucide-react';

const navigationItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم', roles: ['admin'] },
  { path: '/pos', icon: Calculator, label: 'نقطة البيع', roles: ['admin', 'cashier'] },
  { path: '/invoices', icon: Receipt, label: 'إدارة الفواتير', roles: ['admin'] },
  { path: '/promotions', icon: Tag, label: 'العروض', roles: ['admin', 'cashier'] },
  { path: '/customers', icon: Users, label: 'العملاء', roles: ['admin'] },
  { path: '/shifts', icon: Clock, label: 'إدارة الشيفتات', roles: ['admin'] },
  { path: '/attendance', icon: UserCheck, label: 'الحضور والانصراف', roles: ['admin'] },
  { path: '/kitchen', icon: ChefHat, label: 'المطبخ', roles: ['admin', 'kitchen'] },
  { path: '/products', icon: Package, label: 'المنتجات', roles: ['admin'] },
  { path: '/inventory', icon: Warehouse, label: 'المخزون', roles: ['admin'] },
  { path: '/suppliers', icon: Truck, label: 'الموردين', roles: ['admin'] },
  { path: '/reports', icon: BarChart3, label: 'التقارير', roles: ['admin'] },
  { path: '/employees', icon: Users, label: 'الموظفين', roles: ['admin'] },
  { path: '/waiters', icon: Users, label: 'الويترية', roles: ['admin'] },
  { path: '/menu', icon: MenuIcon, label: 'المنيو', roles: ['admin', 'cashier'] },
  { path: '/orders', icon: ShoppingCart, label: 'الطلبات', roles: ['admin'] },
  { path: '/settings', icon: Settings, label: 'الإعدادات', roles: ['admin'] },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'admin')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">مطعم ابوالفتوح للمأكولات الشامية</h1>
                <p className="text-sm text-gray-600">القاهرة، مصر</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-600">
                {user?.role === 'admin' && 'مدير'}
                {user?.role === 'cashier' && 'كاشير'}
                {user?.role === 'kitchen' && 'مطبخ'}
              </p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-orange-500 text-white">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`
          fixed md:static inset-y-0 right-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          top-[80px] md:top-0
        `}>
          <div className="p-6 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
