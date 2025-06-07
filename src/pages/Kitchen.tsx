
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Timer,
  Eye
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  priority: 'normal' | 'urgent';
  orderTime: Date;
  estimatedTime: number; // minutes
  tableNumber?: string;
  notes?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'أحمد محمد',
      items: [
        { name: 'شاورما لحم', quantity: 2 },
        { name: 'فتوش', quantity: 1 },
        { name: 'عصير برتقال', quantity: 2 }
      ],
      status: 'pending',
      priority: 'urgent',
      orderTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      estimatedTime: 15,
      tableNumber: '5',
      notes: 'بدون بصل في الشاورما'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'فاطمة علي',
      items: [
        { name: 'فروج مشوي', quantity: 1 },
        { name: 'تبولة', quantity: 1 },
        { name: 'شاي أحمر', quantity: 1 }
      ],
      status: 'preparing',
      priority: 'normal',
      orderTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      estimatedTime: 20,
      tableNumber: '3'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'محمد سالم',
      items: [
        { name: 'كباب مشكل', quantity: 3 },
        { name: 'حمص بطحينة', quantity: 2 },
        { name: 'متبل', quantity: 1 }
      ],
      status: 'ready',
      priority: 'normal',
      orderTime: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      estimatedTime: 25,
      tableNumber: '7'
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'preparing': return <Timer className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTimeElapsed = (orderTime: Date) => {
    const elapsed = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60));
    return elapsed;
  };

  const getPriorityColor = (priority: Order['priority']) => {
    return priority === 'urgent' ? 'bg-red-500' : 'bg-blue-500';
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-orange-600" />
            شاشة المطبخ
          </h1>
          <p className="text-gray-600 mt-2">إدارة الطلبات والتحضير</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString('ar-SA')}
          </p>
          <p className="text-sm text-gray-600">
            {pendingOrders.length} طلب في الانتظار • {preparingOrders.length} قيد التحضير
          </p>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            طلبات جديدة ({pendingOrders.length})
          </h2>
          {pendingOrders.map((order) => (
            <Card key={order.id} className="border-r-4 border-red-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.orderNumber}
                      <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                        {order.priority === 'urgent' ? 'عاجل' : 'عادي'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    {order.tableNumber && (
                      <p className="text-sm font-medium text-blue-600">طاولة {order.tableNumber}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-red-600 font-medium">
                      {getTimeElapsed(order.orderTime)} دقيقة
                    </p>
                    <p className="text-gray-500">منذ الطلب</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
                
                {order.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">ملاحظات:</p>
                    <p className="text-sm text-yellow-700">{order.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    <Timer className="h-4 w-4 mr-1" />
                    بدء التحضير
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preparing Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
            <Timer className="h-5 w-5" />
            قيد التحضير ({preparingOrders.length})
          </h2>
          {preparingOrders.map((order) => (
            <Card key={order.id} className="border-r-4 border-yellow-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.orderNumber}
                      <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                        {order.priority === 'urgent' ? 'عاجل' : 'عادي'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    {order.tableNumber && (
                      <p className="text-sm font-medium text-blue-600">طاولة {order.tableNumber}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-yellow-600 font-medium">
                      {getTimeElapsed(order.orderTime)} دقيقة
                    </p>
                    <p className="text-gray-500">قيد التحضير</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
                
                {order.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">ملاحظات:</p>
                    <p className="text-sm text-yellow-700">{order.notes}</p>
                  </div>
                )}

                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600"
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  جاهز للتقديم
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-600 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            جاهز للتقديم ({readyOrders.length})
          </h2>
          {readyOrders.map((order) => (
            <Card key={order.id} className="border-r-4 border-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.orderNumber}
                      <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                        {order.priority === 'urgent' ? 'عاجل' : 'عادي'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    {order.tableNumber && (
                      <p className="text-sm font-medium text-blue-600">طاولة {order.tableNumber}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-green-600 font-medium">جاهز</p>
                    <p className="text-gray-500">للتقديم</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="secondary">{item.quantity}</Badge>
                    </div>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                >
                  تم التقديم
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
