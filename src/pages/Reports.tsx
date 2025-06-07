
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Printer,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedReport, setSelectedReport] = useState('sales');

  const periods = [
    { id: 'today', name: 'اليوم' },
    { id: 'week', name: 'هذا الأسبوع' },
    { id: 'month', name: 'هذا الشهر' },
    { id: 'quarter', name: 'هذا الربع' },
    { id: 'year', name: 'هذا العام' },
  ];

  const reportTypes = [
    { id: 'sales', name: 'تقرير المبيعات', icon: DollarSign },
    { id: 'products', name: 'تقرير المنتجات', icon: Package },
    { id: 'customers', name: 'تقرير العملاء', icon: Users },
    { id: 'inventory', name: 'تقرير المخزون', icon: BarChart3 },
  ];

  // Mock data for charts
  const salesData = [
    { name: 'السبت', sales: 12450, orders: 45, profit: 3200 },
    { name: 'الأحد', sales: 15600, orders: 52, profit: 4100 },
    { name: 'الاثنين', sales: 9800, orders: 38, profit: 2800 },
    { name: 'الثلاثاء', sales: 18200, orders: 67, profit: 5200 },
    { name: 'الأربعاء', sales: 14500, orders: 51, profit: 3900 },
    { name: 'الخميس', sales: 21300, orders: 78, profit: 6400 },
    { name: 'الجمعة', sales: 19700, orders: 71, profit: 5800 },
  ];

  const productData = [
    { name: 'شاورما لحم', sales: 156, revenue: 3900 },
    { name: 'فروج مشوي', sales: 89, revenue: 3115 },
    { name: 'كباب مشكل', sales: 67, revenue: 3015 },
    { name: 'فتوش', sales: 134, revenue: 2010 },
    { name: 'حمص بطحينة', sales: 98, revenue: 980 },
  ];

  const categoryData = [
    { name: 'الأطباق الرئيسية', value: 45, color: '#f97316' },
    { name: 'المقبلات', value: 25, color: '#06b6d4' },
    { name: 'السلطات', value: 20, color: '#10b981' },
    { name: 'المشروبات', value: 10, color: '#8b5cf6' },
  ];

  const hourlyData = [
    { hour: '09:00', orders: 12 },
    { hour: '10:00', orders: 19 },
    { hour: '11:00', orders: 25 },
    { hour: '12:00', orders: 45 },
    { hour: '13:00', orders: 67 },
    { hour: '14:00', orders: 58 },
    { hour: '15:00', orders: 34 },
    { hour: '16:00', orders: 28 },
    { hour: '17:00', orders: 31 },
    { hour: '18:00', orders: 42 },
    { hour: '19:00', orders: 55 },
    { hour: '20:00', orders: 48 },
    { hour: '21:00', orders: 39 },
    { hour: '22:00', orders: 22 },
  ];

  // Calculate totals
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalProfit = salesData.reduce((sum, day) => sum + day.profit, 0);
  const avgOrderValue = totalSales / totalOrders;

  const handleExportPDF = () => {
    console.log('Exporting PDF report...');
    alert('سيتم تصدير التقرير كملف PDF');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel report...');
    alert('سيتم تصدير التقرير كملف Excel');
  };

  const handlePrint = () => {
    console.log('Printing report...');
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600 mt-2">تحليلات شاملة لأداء المطعم</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            طباعة
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileText className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportPDF} className="bg-gradient-to-r from-orange-500 to-red-500">
            <Download className="h-4 w-4 mr-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            فلترة التقارير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">الفترة الزمنية:</label>
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <Button
                  key={period.id}
                  variant={selectedPeriod === period.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={selectedPeriod === period.id ? 
                    "bg-gradient-to-r from-orange-500 to-red-500" : ""
                  }
                >
                  {period.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">نوع التقرير:</label>
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <Button
                    key={report.id}
                    variant={selectedReport === report.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedReport(report.id)}
                    className={selectedReport === report.id ? 
                      "bg-gradient-to-r from-blue-500 to-blue-600" : ""
                    }
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {report.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-green-600">{totalSales.toLocaleString()} ج.م</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% عن الفترة السابقة
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عدد الطلبات</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% عن الفترة السابقة
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                <p className="text-2xl font-bold text-orange-600">{totalProfit.toLocaleString()} ج.م</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15% عن الفترة السابقة
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط قيمة الطلب</p>
                <p className="text-2xl font-bold text-purple-600">{avgOrderValue.toFixed(0)} ج.م</p>
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% عن الفترة السابقة
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>مخطط المبيعات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} ${name === 'sales' ? 'ج.م' : name === 'profit' ? 'ج.م' : ''}`,
                    name === 'sales' ? 'المبيعات' : name === 'orders' ? 'الطلبات' : 'الربح'
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === 'sales' ? 'المبيعات' : value === 'orders' ? 'الطلبات' : 'الربح'
                  }
                />
                <Bar dataKey="sales" fill="#f97316" />
                <Bar dataKey="profit" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع المبيعات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Orders */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات حسب الساعة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'عدد الطلبات']} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-bold">
                      #{index + 1}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.sales} مبيعة</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.revenue.toLocaleString()} ج.م</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(product.sales / Math.max(...productData.map(p => p.sales))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>الملخص المالي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">الإيرادات</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي المبيعات:</span>
                  <span className="font-bold">{totalSales.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضرائب المحصلة:</span>
                  <span className="font-bold">{(totalSales * 0.15).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الخصومات الممنوحة:</span>
                  <span className="font-bold text-red-600">-{(totalSales * 0.05).toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">التكاليف</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">تكلفة المواد الخام:</span>
                  <span className="font-bold">{(totalSales * 0.35).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رواتب الموظفين:</span>
                  <span className="font-bold">{(totalSales * 0.25).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مصروفات أخرى:</span>
                  <span className="font-bold">{(totalSales * 0.1).toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">صافي الربح</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">الربح الإجمالي:</span>
                  <span className="font-bold text-green-600">{totalProfit.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">هامش الربح:</span>
                  <span className="font-bold text-green-600">{((totalProfit / totalSales) * 100).toFixed(1)}%</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 mt-3">
                  <p className="text-center text-lg font-bold text-green-800">
                    صافي الربح النهائي: {totalProfit.toLocaleString()} ج.م
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
