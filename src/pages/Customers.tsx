import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomerFormDialog } from '@/components/CustomerFormDialog';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastVisit: Date;
  status: 'active' | 'inactive';
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock customers data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'أحمد محمد سالم',
      phone: '01029116415',
      address: 'سوهاج, مصر',
      totalOrders: 15,
      totalSpent: 1250.75,
      lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '2',
      name: 'فاطمة علي أحمد',
      phone: '010000000000',
      address: 'القاهرة, مصر',
      totalOrders: 8,
      totalSpent: 680.50,
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: '3',
      name: 'خالد سالم',
      phone: '012900000000',
      totalOrders: 3,
      totalSpent: 185.25,
      lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'inactive'
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
    }
  };

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (selectedCustomer) {
      // Update existing customer
      setCustomers(customers.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, ...customerData }
          : customer
      ));
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: customerData.name || '',
        phone: customerData.phone || '',
        email: customerData.email || '',
        address: customerData.address || '',
        totalOrders: 0,
        totalSpent: 0,
        lastVisit: new Date(),
        status: 'active'
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsFormOpen(false);
  };

  const getStatusColor = (status: Customer['status']) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusName = (status: Customer['status']) => {
    return status === 'active' ? 'نشط' : 'غير نشط';
  };

  // Statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpentPerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            إدارة العملاء
          </h1>
          <p className="text-gray-600 mt-2">إدارة قاعدة بيانات العملاء</p>
        </div>
        <Button onClick={handleAddCustomer} className="bg-gradient-to-r from-blue-500 to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          عميل جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عملاء نشطون</p>
                <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()} ج.م</p>
              </div>
              <Phone className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الإنفاق</p>
                <p className="text-2xl font-bold text-orange-600">{avgSpentPerCustomer.toFixed(0)} ج.م</p>
              </div>
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>البحث عن العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث بالاسم أو الهاتف أو البريد الإلكتروني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>العملاء ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead >الاسم</TableHead>
                <TableHead >الهاتف</TableHead>
                <TableHead >عدد الطلبات</TableHead>
                <TableHead >إجمالي الإنفاق</TableHead>
                <TableHead className="text-left pl-6">آخر زيارة</TableHead>
                <TableHead className="text-left pl-6">الحالة</TableHead>
                <TableHead className="text-left pl-6">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      {customer.address && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.address}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1" dir="ltr">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-bold">{customer.totalOrders}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">{customer.totalSpent.toFixed(2)} ج.م</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{customer.lastVisit.toLocaleDateString('ar-EG')}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusName(customer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عملاء</h3>
              <p className="text-gray-600">لم يتم العثور على عملاء يطابقون البحث الحالي</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default Customers;
