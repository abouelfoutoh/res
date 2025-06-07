
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  User,
  Calendar,
  DollarSign,
  Phone,
  MapPin,
  Eye,
  Printer
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  orderTime: Date;
  estimatedDelivery?: Date;
  tableNumber?: string;
  paymentMethod: 'cash' | 'card' | 'online';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  deliveryFee?: number;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');

  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'أحمد محمد سالم',
      customerPhone: '+966501234567',
      customerAddress: 'الرياض، حي النخيل، شارع الملك فهد',
      items: [
        { name: 'شاورما لحم', quantity: 2, price: 25 },
        { name: 'فتوش', quantity: 1, price: 15 },
        { name: 'عصير برتقال', quantity: 2, price: 8 }
      ],
      subtotal: 81,
      tax: 12.15,
      discount: 5,
      total: 88.15,
      status: 'pending',
      orderType: 'delivery',
      orderTime: new Date(Date.now() - 5 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000),
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      notes: 'بدون بصل في الشاورما',
      deliveryFee: 15
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'فاطمة علي أحمد',
      customerPhone: '+966507654321',
      items: [
        { name: 'فروج مشوي', quantity: 1, price: 35 },
        { name: 'تبولة', quantity: 1, price: 12 },
        { name: 'شاي أحمر', quantity: 1, price: 5 }
      ],
      subtotal: 52,
      tax: 7.8,
      discount: 0,
      total: 59.8,
      status: 'preparing',
      orderType: 'dine-in',
      orderTime: new Date(Date.now() - 15 * 60 * 1000),
      tableNumber: '3',
      paymentMethod: 'card',
      paymentStatus: 'paid'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'محمد سالم عبدالله',
      customerPhone: '+966509876543',
      items: [
        { name: 'كباب مشكل', quantity: 3, price: 45 },
        { name: 'حمص بطحينة', quantity: 2, price: 10 },
        { name: 'متبل', quantity: 1, price: 8 }
      ],
      subtotal: 163,
      tax: 24.45,
      discount: 16.3,
      total: 171.15,
      status: 'ready',
      orderType: 'takeaway',
      orderTime: new Date(Date.now() - 30 * 60 * 1000),
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      notes: 'طلب عائلي - خصم 10%'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'سارة أحمد محمد',
      customerPhone: '+966502468135',
      customerAddress: 'الرياض، حي العليا، مجمع الراشد',
      items: [
        { name: 'فتوش', quantity: 2, price: 15 },
        { name: 'عصير ليمون نعنع', quantity: 3, price: 8 },
        { name: 'كنافة نابلسية', quantity: 2, price: 18 }
      ],
      subtotal: 90,
      tax: 13.5,
      discount: 0,
      total: 118.5,
      status: 'delivered',
      orderType: 'delivery',
      orderTime: new Date(Date.now() - 120 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 80 * 60 * 1000),
      paymentMethod: 'online',
      paymentStatus: 'paid',
      deliveryFee: 15
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customerName: 'خالد سالم أحمد',
      customerPhone: '+966501357924',
      items: [
        { name: 'شاورما لحم', quantity: 1, price: 25 }
      ],
      subtotal: 25,
      tax: 3.75,
      discount: 0,
      total: 28.75,
      status: 'cancelled',
      orderType: 'takeaway',
      orderTime: new Date(Date.now() - 45 * 60 * 1000),
      paymentMethod: 'cash',
      paymentStatus: 'refunded',
      notes: 'إلغاء بطلب من العميل'
    }
  ]);

  const statusOptions = [
    { id: 'all', name: 'جميع الطلبات' },
    { id: 'pending', name: 'في الانتظار' },
    { id: 'preparing', name: 'قيد التحضير' },
    { id: 'ready', name: 'جاهز' },
    { id: 'delivered', name: 'تم التسليم' },
    { id: 'cancelled', name: 'ملغي' },
  ];

  const typeOptions = [
    { id: 'all', name: 'جميع الأنواع' },
    { id: 'dine-in', name: 'تناول في المطعم' },
    { id: 'takeaway', name: 'استلام' },
    { id: 'delivery', name: 'توصيل' },
  ];

  const paymentOptions = [
    { id: 'all', name: 'جميع طرق الدفع' },
    { id: 'cash', name: 'نقدي' },
    { id: 'card', name: 'بطاقة' },
    { id: 'online', name: 'دفع إلكتروني' },
  ];

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-red-100 text-red-800 border-red-200',
      preparing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ready: 'bg-blue-100 text-blue-800 border-blue-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order['status']) => {
    const icons = {
      pending: <AlertCircle className="h-4 w-4" />,
      preparing: <Clock className="h-4 w-4" />,
      ready: <CheckCircle className="h-4 w-4" />,
      delivered: <Truck className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status];
  };

  const getTypeColor = (type: Order['orderType']) => {
    const colors = {
      'dine-in': 'bg-blue-100 text-blue-800',
      'takeaway': 'bg-green-100 text-green-800',
      'delivery': 'bg-orange-100 text-orange-800',
    };
    return colors[type];
  };

  const getTypeName = (type: Order['orderType']) => {
    const names = {
      'dine-in': 'في المطعم',
      'takeaway': 'استلام',
      'delivery': 'توصيل',
    };
    return names[type];
  };

  const getPaymentColor = (status: Order['paymentStatus']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getPaymentStatusName = (status: Order['paymentStatus']) => {
    const names = {
      pending: 'في الانتظار',
      paid: 'مدفوع',
      refunded: 'مسترد',
    };
    return names[status];
  };

  const getTimeElapsed = (orderTime: Date) => {
    const elapsed = Math.floor((Date.now() - orderTime.getTime()) / (1000 * 60));
    if (elapsed < 60) {
      return `${elapsed} دقيقة`;
    } else {
      const hours = Math.floor(elapsed / 60);
      const minutes = elapsed % 60;
      return `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.orderType === selectedType;
    const matchesPayment = selectedPayment === 'all' || order.paymentMethod === selectedPayment;
    
    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const todayRevenue = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? todayRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            إدارة الطلبات
          </h1>
          <p className="text-gray-600 mt-2">متابعة وإدارة طلبات العملاء</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            طباعة التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طلبات في الانتظار</p>
                <p className="text-2xl font-bold text-red-600">{pendingOrders}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إيرادات اليوم</p>
                <p className="text-2xl font-bold text-green-600">{todayRevenue.toLocaleString()} ج.م</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط قيمة الطلب</p>
                <p className="text-2xl font-bold text-purple-600">{avgOrderValue.toFixed(0)} ج.م</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">حالة الطلب:</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status.id}
                    variant={selectedStatus === status.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status.id)}
                    className={selectedStatus === status.id ? 
                      "bg-gradient-to-r from-orange-500 to-red-500" : ""
                    }
                  >
                    {status.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">نوع الطلب:</label>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className={selectedType === type.id ? 
                      "bg-gradient-to-r from-blue-500 to-blue-600" : ""
                    }
                  >
                    {type.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">طريقة الدفع:</label>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((payment) => (
                  <Button
                    key={payment.id}
                    variant={selectedPayment === payment.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPayment(payment.id)}
                    className={selectedPayment === payment.id ? 
                      "bg-gradient-to-r from-green-500 to-green-600" : ""
                    }
                  >
                    {payment.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {getTimeElapsed(order.orderTime)} منذ الطلب
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="mr-1">
                          {selectedStatus === 'all' && order.status === 'pending' && 'في الانتظار'}
                          {selectedStatus === 'all' && order.status === 'preparing' && 'قيد التحضير'}
                          {selectedStatus === 'all' && order.status === 'ready' && 'جاهز'}
                          {selectedStatus === 'all' && order.status === 'delivered' && 'تم التسليم'}
                          {selectedStatus === 'all' && order.status === 'cancelled' && 'ملغي'}
                          {selectedStatus !== 'all' && statusOptions.find(s => s.id === order.status)?.name}
                        </span>
                      </Badge>
                      <Badge className={getTypeColor(order.orderType)}>
                        {getTypeName(order.orderType)}
                      </Badge>
                      <Badge className={getPaymentColor(order.paymentStatus)}>
                        {getPaymentStatusName(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{order.total.toFixed(2)} ج.م</p>
                    <p className="text-sm text-gray-600">{order.paymentMethod === 'cash' ? 'نقدي' : order.paymentMethod === 'card' ? 'بطاقة' : 'إلكتروني'}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-600">العميل</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium" dir="ltr">{order.customerPhone}</p>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                    </div>
                  </div>
                  {order.orderType === 'delivery' && order.customerAddress && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{order.customerAddress}</p>
                        <p className="text-sm text-gray-600">العنوان</p>
                      </div>
                    </div>
                  )}
                  {order.orderType === 'dine-in' && order.tableNumber && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">طاولة {order.tableNumber}</p>
                        <p className="text-sm text-gray-600">رقم الطاولة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">تفاصيل الطلب:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{item.quantity}×</Badge>
                          <span className="font-medium">{item.name}</span>
                          {item.notes && (
                            <span className="text-sm text-gray-600">({item.notes})</span>
                          )}
                        </div>
                        <span className="font-bold">{(item.quantity * item.price).toFixed(2)} ج.م</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {order.notes && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">ملاحظات:</p>
                        <p className="text-sm text-yellow-700">{order.notes}</p>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>التسليم المتوقع: {order.estimatedDelivery.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{order.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>الخصم:</span>
                        <span>-{order.discount.toFixed(2)} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>الضريبة:</span>
                      <span>{order.tax.toFixed(2)} ج.م</span>
                    </div>
                    {order.deliveryFee && (
                      <div className="flex justify-between">
                        <span>رسوم التوصيل:</span>
                        <span>{order.deliveryFee.toFixed(2)} ج.م</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-1">
                      <span>الإجمالي:</span>
                      <span className="text-orange-600">{order.total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-1" />
                    طباعة الفاتورة
                  </Button>
                  {order.status === 'pending' && (
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600">
                      بدء التحضير
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600">
                      جاهز للتسليم
                    </Button>
                  )}
                  {order.status === 'ready' && order.orderType !== 'dine-in' && (
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-orange-600">
                      تم التسليم
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600">لم يتم العثور على طلبات تطابق البحث الحالي</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
