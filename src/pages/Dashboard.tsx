import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ حماية الصفحة بناءً على الدور
  useEffect(() => {
    if (!user) {
      navigate('/login'); // غير مسجل دخول
    } else if (user.role === 'cashier') {
      navigate('/pos'); // كاشير
      //المطبخ
    } else if (user.role === 'kitchen') {
      navigate('/kitchen'); // صفحة المطبخ
    }
  }, [user, navigate]);

  // بيانات وهمية للعرض
  const todayStats = {
    sales: 12450,
    orders: 67,
    customers: 45,
    profit: 3200
  };

  const recentOrders = [
    { id: '001', customer: 'أحمد محمد', items: 3, total: 285, status: 'completed' },
    { id: '002', customer: 'فاطمة علي', items: 2, total: 150, status: 'preparing' },
    { id: '003', customer: 'محمد سالم', items: 4, total: 420, status: 'pending' },
  ];

  const lowStockItems = [
    { name: 'أرز بسمتي', current: 15, minimum: 20 },
    { name: 'دجاج مقطع', current: 8, minimum: 10 },
    { name: 'طحينة', current: 5, minimum: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً {user?.name}، إليك ملخص اليوم</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('ar-EG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">مبيعات اليوم</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.sales.toLocaleString()} ج.م</div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% عن الأمس
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">عدد الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.orders}</div>
            <p className="text-xs text-blue-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% عن الأمس
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">العملاء</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{todayStats.customers}</div>
            <p className="text-xs text-purple-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% عن الأمس
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">صافي الربح</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{todayStats.profit.toLocaleString()} ج.م</div>
            <p className="text-xs text-orange-600 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% عن الأمس
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الطلبات الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              الطلبات الأخيرة
            </CardTitle>
            <CardDescription>آخر الطلبات المسجلة اليوم</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100' :
                      order.status === 'preparing' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {order.status === 'completed' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> :
                        order.status === 'preparing' ? 
                        <Clock className="h-4 w-4 text-yellow-600" /> :
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-600">طلب رقم {order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total} ج.م</p>
                    <p className="text-sm text-gray-600">{order.items} عناصر</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* تنبيهات المخزون */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              تنبيهات المخزون
            </CardTitle>
            <CardDescription>المواد التي تحتاج إعادة تخزين</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">{item.name}</p>
                      <p className="text-sm text-red-600">الحد الأدنى: {item.minimum}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-800">{item.current} متاح</p>
                    <p className="text-sm text-red-600">مخزون منخفض</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
