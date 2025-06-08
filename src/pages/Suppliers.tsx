
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Printer,
  X,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  isActive: boolean;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
  rating: number;
  notes: string;
}

interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  notes: string;
}

const Suppliers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form states
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    notes: ''
  });

  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    deliveryDate: '',
    items: [{ name: '', quantity: 1, unit: 'كيلو', unitPrice: 0, total: 0 }] as PurchaseOrderItem[],
    notes: ''
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'مؤسسة النيل للحوم',
      contactPerson: 'أحمد محمد',
      phone: '01234567890',
      email: 'info@nile-meat.com',
      address: 'الجيزة، مصر',
      category: 'meat',
      isActive: true,
      totalOrders: 45,
      totalAmount: 125000,
      lastOrderDate: '2024-01-15',
      rating: 4.5,
      notes: 'مورد موثوق للحوم الطازجة'
    },
    {
      id: '2',
      name: 'شركة الدلتا للخضروات',
      contactPerson: 'فاطمة علي',
      phone: '01234567891',
      email: 'orders@delta-veg.com',
      address: 'الإسكندرية، مصر',
      category: 'vegetables',
      isActive: true,
      totalOrders: 32,
      totalAmount: 85000,
      lastOrderDate: '2024-01-14',
      rating: 4.2,
      notes: 'خضروات طازجة يومياً'
    },
    {
      id: '3',
      name: 'مخبز الأصالة',
      contactPerson: 'محمد حسن',
      phone: '01234567892',
      email: 'bread@asala.com',
      address: 'القاهرة، مصر',
      category: 'bakery',
      isActive: true,
      totalOrders: 28,
      totalAmount: 45000,
      lastOrderDate: '2024-01-13',
      rating: 4.8,
      notes: 'خبز طازج وعجائن'
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO001',
      supplierId: '1',
      supplierName: 'مؤسسة النيل للحوم',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      items: [
        { name: 'لحم بقري', quantity: 50, unit: 'كيلو', unitPrice: 180, total: 9000 },
        { name: 'لحم ضأن', quantity: 25, unit: 'كيلو', unitPrice: 220, total: 5500 }
      ],
      subtotal: 14500,
      tax: 2030,
      total: 16530,
      status: 'delivered',
      notes: 'تم التسليم في الموعد'
    }
  ]);

  const categories = [
    { id: 'all', name: 'جميع الموردين' },
    { id: 'meat', name: 'اللحوم' },
    { id: 'vegetables', name: 'الخضروات' },
    { id: 'bakery', name: 'المخبوزات' },
    { id: 'dairy', name: 'الألبان' },
    { id: 'spices', name: 'البهارات' },
    { id: 'beverages', name: 'المشروبات' },
    { id: 'other', name: 'أخرى' }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const handleAddSupplier = () => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier,
      isActive: true,
      totalOrders: 0,
      totalAmount: 0,
      lastOrderDate: '',
      rating: 0
    };
    
    setSuppliers(prev => [...prev, supplier]);
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      category: '',
      notes: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة المورد",
      description: "تم إضافة مورد جديد بنجاح",
    });
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast({
      title: "تم حذف المورد",
      description: "تم حذف المورد بنجاح",
    });
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier) return;
    
    setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? editingSupplier : s));
    setEditingSupplier(null);
    
    toast({
      title: "تم تحديث المورد",
      description: "تم تحديث بيانات المورد بنجاح",
    });
  };

  const handleAddOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unit: 'كيلو', unitPrice: 0, total: 0 }]
    }));
  };

  const handleRemoveOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleOrderItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setNewOrder(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      
      // Calculate total for this item
      if (field === 'quantity' || field === 'unitPrice') {
        items[index].total = items[index].quantity * items[index].unitPrice;
      }
      
      return { ...prev, items };
    });
  };

  const calculateOrderTotals = () => {
    const subtotal = newOrder.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateOrder = () => {
    if (!newOrder.supplierId || newOrder.items.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المورد وإضافة الأصناف",
        variant: "destructive"
      });
      return;
    }

    const supplier = suppliers.find(s => s.id === newOrder.supplierId);
    if (!supplier) return;

    const { subtotal, tax, total } = calculateOrderTotals();
    
    const order: PurchaseOrder = {
      id: `PO${Date.now()}`,
      supplierId: newOrder.supplierId,
      supplierName: supplier.name,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: newOrder.deliveryDate,
      items: newOrder.items.filter(item => item.name && item.quantity > 0),
      subtotal,
      tax,
      total,
      status: 'pending',
      notes: newOrder.notes
    };

    setPurchaseOrders(prev => [...prev, order]);
    setNewOrder({
      supplierId: '',
      deliveryDate: '',
      items: [{ name: '', quantity: 1, unit: 'كيلو', unitPrice: 0, total: 0 }],
      notes: ''
    });
    setShowOrderForm(false);

    toast({
      title: "تم إنشاء أمر الشراء",
      description: "تم إنشاء أمر شراء جديد بنجاح",
    });
  };

  const handlePrintInvoice = (order: PurchaseOrder) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>فاتورة شراء - ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
              .invoice-details { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #000; padding: 8px; text-align: center; }
              .totals { text-align: left; }
              .totals div { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>مطعم ابوالفتوح للمأكولات الشامية</h1>
              <p>القاهرة، مصر</p>
              <h2>فاتورة شراء</h2>
            </div>
            
            <div class="invoice-details">
              <p><strong>رقم الفاتورة:</strong> ${order.id}</p>
              <p><strong>المورد:</strong> ${order.supplierName}</p>
              <p><strong>تاريخ الطلب:</strong> ${order.orderDate}</p>
              <p><strong>تاريخ التسليم:</strong> ${order.deliveryDate}</p>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>الوحدة</th>
                  <th>سعر الوحدة</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit}</td>
                    <td>${item.unitPrice.toFixed(2)} جنيه</td>
                    <td>${item.total.toFixed(2)} جنيه</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div><strong>المجموع الفرعي: ${order.subtotal.toFixed(2)} جنيه</strong></div>
              <div><strong>الضريبة (14%): ${order.tax.toFixed(2)} جنيه</strong></div>
              <div style="font-size: 18px;"><strong>الإجمالي: ${order.total.toFixed(2)} جنيه</strong></div>
            </div>

            <div style="margin-top: 40px; text-align: center;">
              <p>شكراً لتعاملكم معنا</p>
              <p>التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0);
  const totalAmount = suppliers.reduce((sum, s) => sum + s.totalAmount, 0);
  const averageRating = suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="h-8 w-8 text-orange-600" />
            إدارة الموردين
          </h1>
          <p className="text-gray-600 mt-2">إدارة الموردين وأوامر الشراء</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowOrderForm(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            أمر شراء جديد
          </Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة مورد جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الموردين النشطين</p>
                <p className="text-2xl font-bold text-green-600">{activeSuppliers}</p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold text-orange-600">{totalAmount.toLocaleString()} جنيه</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              </div>
              <span className="text-2xl">⭐</span>
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
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث عن مورد أو شخص الاتصال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 
                  "bg-gradient-to-r from-orange-500 to-red-500" : ""
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{supplier.name}</h3>
                  <Badge variant={supplier.isActive ? "default" : "secondary"}>
                    {supplier.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant="outline">{getCategoryName(supplier.category)}</Badge>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">الطلبات: </span>
                      <span className="font-medium">{supplier.totalOrders}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">التقييم: </span>
                      <span className="font-medium">{supplier.rating} ⭐</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">إجمالي المشتريات: </span>
                    <span className="font-bold text-orange-600">{supplier.totalAmount.toLocaleString()} جنيه</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">آخر طلب: </span>
                    <span className="font-medium">{supplier.lastOrderDate}</span>
                  </div>
                </div>

                {supplier.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{supplier.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    عرض
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setEditingSupplier(supplier)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteSupplier(supplier.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            أوامر الشراء الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchaseOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.supplierName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {order.status === 'delivered' ? 'تم التسليم' :
                       order.status === 'pending' ? 'في الانتظار' : 'ملغي'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePrintInvoice(order)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      طباعة
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">تاريخ الطلب: </span>
                    <span className="font-medium">{order.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ التسليم: </span>
                    <span className="font-medium">{order.deliveryDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">عدد الأصناف: </span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الإجمالي: </span>
                    <span className="font-bold text-orange-600">{order.total.toFixed(2)} جنيه</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Supplier Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة مورد جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم المورد</Label>
              <Input
                id="name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم المورد"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">شخص الاتصال</Label>
              <Input
                id="contactPerson"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="اسم شخص الاتصال"
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="رقم الهاتف"
              />
            </div>
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                placeholder="البريد الإلكتروني"
              />
            </div>
            <div>
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
                placeholder="العنوان"
              />
            </div>
            <div>
              <Label htmlFor="category">التصنيف</Label>
              <Select 
                value={newSupplier.category} 
                onValueChange={(value) => setNewSupplier(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={newSupplier.notes}
                onChange={(e) => setNewSupplier(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddSupplier} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل المورد</DialogTitle>
          </DialogHeader>
          {editingSupplier && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">اسم المورد</Label>
                <Input
                  id="edit-name"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  placeholder="اسم المورد"
                />
              </div>
              <div>
                <Label htmlFor="edit-contactPerson">شخص الاتصال</Label>
                <Input
                  id="edit-contactPerson"
                  value={editingSupplier.contactPerson}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, contactPerson: e.target.value }) : null)}
                  placeholder="اسم شخص الاتصال"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  value={editingSupplier.phone}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingSupplier.email}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div>
                <Label htmlFor="edit-address">العنوان</Label>
                <Input
                  id="edit-address"
                  value={editingSupplier.address}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, address: e.target.value }) : null)}
                  placeholder="العنوان"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">التصنيف</Label>
                <Select 
                  value={editingSupplier.category} 
                  onValueChange={(value) => setEditingSupplier(prev => prev ? ({ ...prev, category: value }) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSupplier.notes}
                  onChange={(e) => setEditingSupplier(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                  placeholder="ملاحظات"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateSupplier} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التعديلات
                </Button>
                <Button variant="outline" onClick={() => setEditingSupplier(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Purchase Order Dialog */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إنشاء أمر شراء جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">المورد</Label>
                <Select 
                  value={newOrder.supplierId} 
                  onValueChange={(value) => setNewOrder(prev => ({ ...prev, supplierId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.filter(s => s.isActive).map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliveryDate">تاريخ التسليم</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={newOrder.deliveryDate}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>الأصناف</Label>
                <Button size="sm" onClick={handleAddOrderItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة صنف
                </Button>
              </div>
              
              <div className="space-y-4">
                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-end">
                    <div>
                      <Label>الصنف</Label>
                      <Input
                        placeholder="اسم الصنف"
                        value={item.name}
                        onChange={(e) => handleOrderItemChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>الكمية</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleOrderItemChange(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>الوحدة</Label>
                      <Select 
                        value={item.unit} 
                        onValueChange={(value) => handleOrderItemChange(index, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="كيلو">كيلو</SelectItem>
                          <SelectItem value="جرام">جرام</SelectItem>
                          <SelectItem value="قطعة">قطعة</SelectItem>
                          <SelectItem value="علبة">علبة</SelectItem>
                          <SelectItem value="كيس">كيس</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>سعر الوحدة</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleOrderItemChange(index, 'unitPrice', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>الإجمالي</Label>
                      <Input
                        value={`${item.total.toFixed(2)} جنيه`}
                        disabled
                      />
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveOrderItem(index)}
                        disabled={newOrder.items.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="order-notes">ملاحظات</Label>
              <Textarea
                id="order-notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات على الطلب"
              />
            </div>

            {newOrder.items.some(item => item.name && item.quantity > 0) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">ملخص الطلب</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{calculateOrderTotals().subtotal.toFixed(2)} جنيه</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الضريبة (14%):</span>
                    <span>{calculateOrderTotals().tax.toFixed(2)} جنيه</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span>{calculateOrderTotals().total.toFixed(2)} جنيه</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateOrder} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                إنشاء أمر الشراء
              </Button>
              <Button variant="outline" onClick={() => setShowOrderForm(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد موردين</h3>
            <p className="text-gray-600">لم يتم العثور على موردين يطابقون البحث الحالي</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Suppliers;
