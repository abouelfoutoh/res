import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search,
  Calculator,
  CreditCard,
  Banknote,
  Printer,
  Users,
  Truck,
  Home
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
}

interface DeliveryDriver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  vehicleType: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customerName: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  driverName?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  paymentMethod: 'cash' | 'card';
}

const POS = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(14); // 14% tax rate for Egypt
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  
  // Invoice numbering system
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(1000);
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([]);

  // Mock data
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'شاورما لحم', price: 45, category: 'main', stock: 25 },
    { id: '2', name: 'فروج مشوي', price: 65, category: 'main', stock: 15 },
    { id: '3', name: 'كباب مشكل', price: 85, category: 'main', stock: 20 },
    { id: '4', name: 'فتوش', price: 25, category: 'salad', stock: 30 },
    { id: '5', name: 'تبولة', price: 20, category: 'salad', stock: 25 },
    { id: '6', name: 'حمص بطحينة', price: 18, category: 'appetizer', stock: 40 },
    { id: '7', name: 'متبل', price: 15, category: 'appetizer', stock: 35 },
    { id: '8', name: 'عصير برتقال', price: 12, category: 'drinks', stock: 50 },
    { id: '9', name: 'شاي أحمر', price: 8, category: 'drinks', stock: 100 },
    { id: '10', name: 'قهوة عربية', price: 10, category: 'drinks', stock: 80 },
  ]);

  const [tables] = useState<Table[]>([
    { id: '1', number: '1', capacity: 4, status: 'available' },
    { id: '2', number: '2', capacity: 2, status: 'available' },
    { id: '3', number: '3', capacity: 6, status: 'occupied' },
    { id: '4', number: '4', capacity: 4, status: 'available' },
    { id: '5', number: '5', capacity: 8, status: 'available' },
  ]);

  const [drivers] = useState<DeliveryDriver[]>([
    { id: '1', name: 'محمد أحمد', status: 'available', vehicleType: 'motorcycle' },
    { id: '2', name: 'علي حسن', status: 'available', vehicleType: 'motorcycle' },
    { id: '3', name: 'سارة محمد', status: 'busy', vehicleType: 'car' },
    { id: '4', name: 'أحمد سالم', status: 'available', vehicleType: 'bicycle' },
  ]);

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'main', name: 'الأطباق الرئيسية' },
    { id: 'appetizer', name: 'المقبلات' },
    { id: 'salad', name: 'السلطات' },
    { id: 'drinks', name: 'المشروبات' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const hasStock = product.stock > 0;
    return matchesSearch && matchesCategory && hasStock;
  });

  const availableTables = tables.filter(table => table.status === 'available');
  const availableDrivers = drivers.filter(driver => driver.status === 'available');

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "نفد المخزون",
        description: "هذا المنتج غير متوفر حالياً",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantityInCart >= product.stock) {
      toast({
        title: "مخزون غير كافي",
        description: `المخزون المتاح: ${product.stock} قطعة فقط`,
        variant: "destructive"
      });
      return;
    }

    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    const product = products.find(p => p.id === id);
    if (product && newQuantity > product.stock) {
      toast({
        title: "مخزون غير كافي",
        description: `المخزون المتاح: ${product.stock} قطعة فقط`,
        variant: "destructive"
      });
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setOrderType('dine-in');
    setSelectedTable('');
    setSelectedDriver('');
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const total = taxableAmount + taxAmount;

  const generateInvoiceNumber = () => {
    const newInvoiceNumber = lastInvoiceNumber + 1;
    setLastInvoiceNumber(newInvoiceNumber);
    return newInvoiceNumber.toString().padStart(6, '0');
  };

  const reduceInventory = () => {
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const createInvoice = (paymentMethod: 'cash' | 'card'): Invoice => {
    const now = new Date();
    const invoiceNumber = generateInvoiceNumber();
    
    const selectedTableData = tables.find(t => t.id === selectedTable);
    const selectedDriverData = drivers.find(d => d.id === selectedDriver);
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      date: now.toLocaleDateString('ar-EG'),
      time: now.toLocaleTimeString('ar-EG'),
      customerName: customerName || 'عميل',
      orderType,
      tableNumber: selectedTableData?.number,
      driverName: selectedDriverData?.name,
      items: [...cart],
      subtotal,
      discount,
      discountAmount,
      taxRate,
      taxAmount,
      total,
      paymentMethod
    };

    setInvoiceHistory([...invoiceHistory, invoice]);
    return invoice;
  };

  const printInvoice = (invoice?: Invoice) => {
    const invoiceData = invoice || {
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      customerName: customerName || 'عميل',
      orderType,
      tableNumber: tables.find(t => t.id === selectedTable)?.number,
      driverName: drivers.find(d => d.id === selectedDriver)?.name,
      items: cart,
      subtotal,
      discount,
      discountAmount,
      taxRate,
      taxAmount,
      total
    };

    const getOrderTypeText = (type: string) => {
      switch (type) {
        case 'dine-in': return 'داخل المطعم';
        case 'takeaway': return 'تيك أواي';
        case 'delivery': return 'دليفري';
        default: return type;
      }
    };

    const invoiceContent = `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>مطعم ابوالفتوح للمأكولات الشامية</h2>
          <p>القاهرة، مصر</p>
          <p style="font-weight: bold; font-size: 18px;">فاتورة رقم: ${invoiceData.invoiceNumber}</p>
          <p>التاريخ: ${invoiceData.date}</p>
          <p>الوقت: ${invoiceData.time}</p>
          ${invoiceData.customerName !== 'عميل' ? `<p>العميل: ${invoiceData.customerName}</p>` : ''}
          <p><strong>نوع الطلب:</strong> ${getOrderTypeText(invoiceData.orderType)}</p>
          ${invoiceData.tableNumber ? `<p><strong>رقم الطاولة:</strong> ${invoiceData.tableNumber}</p>` : ''}
          ${invoiceData.driverName ? `<p><strong>الطيار:</strong> ${invoiceData.driverName}</p>` : ''}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: right; padding: 8px;">الصنف</th>
              <th style="text-align: center; padding: 8px;">الكمية</th>
              <th style="text-align: center; padding: 8px;">السعر</th>
              <th style="text-align: center; padding: 8px;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="text-align: right; padding: 8px;">${item.name}</td>
                <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                <td style="text-align: center; padding: 8px;">${item.price} ج.م</td>
                <td style="text-align: center; padding: 8px;">${(item.price * item.quantity).toFixed(2)} ج.م</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="border-top: 2px solid #000; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>المجموع الفرعي:</span>
            <span>${invoiceData.subtotal.toFixed(2)} ج.م</span>
          </div>
          ${invoiceData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: green;">
              <span>الخصم (${invoiceData.discount}%):</span>
              <span>-${invoiceData.discountAmount.toFixed(2)} ج.م</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>الضريبة (${invoiceData.taxRate}%):</span>
            <span>${invoiceData.taxAmount.toFixed(2)} ج.م</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #000; padding-top: 5px;">
            <span>الإجمالي النهائي:</span>
            <span>${invoiceData.total.toFixed(2)} ج.م</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>شكراً لزيارتكم</p>
          <p>نتطلع لخدمتكم مرة أخرى</p>
          <p style="margin-top: 10px;">تم الدفع: ${invoice?.paymentMethod === 'cash' ? 'نقداً' : 'بالبطاقة'}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>فاتورة رقم ${invoiceData.invoiceNumber}</title>
            <meta charset="utf-8">
          </head>
          <body>
            ${invoiceContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    // Validate order type requirements
    if (orderType === 'dine-in' && !selectedTable) {
      setShowTableDialog(true);
      return;
    }
    
    if (orderType === 'delivery' && !selectedDriver) {
      setShowDriverDialog(true);
      return;
    }
    
    console.log('Processing checkout:', {
      cart,
      customerName,
      orderType,
      selectedTable,
      selectedDriver,
      subtotal,
      discount,
      taxAmount,
      total,
      paymentMethod
    });
    
    // Create invoice
    const invoice = createInvoice(paymentMethod);
    
    // Reduce inventory
    reduceInventory();
    
    // Print invoice
    printInvoice(invoice);
    
    clearCart();
    toast({
      title: "تم إتمام البيع بنجاح!",
      description: `فاتورة رقم: ${invoice.invoiceNumber} - تم خصم الكميات من المخزون وطباعة الفاتورة`,
    });
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return <Home className="h-4 w-4" />;
      case 'takeaway': return <ShoppingCart className="h-4 w-4" />;
      case 'delivery': return <Truck className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              نقطة البيع (POS)
              <Badge variant="outline" className="mr-auto">
                آخر فاتورة: {lastInvoiceNumber.toString().padStart(6, '0')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Categories */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Category Buttons */}
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

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-orange-600">{product.price} ج.م</p>
                    <p className="text-xs text-gray-500">متوفر: {product.stock}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                السلة ({cart.length})
              </span>
              {cart.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Name */}
            <Input
              placeholder="اسم العميل (اختياري)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            {/* Order Type Selection */}
            <div className="space-y-2">
              <Label>نوع الطلب</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={orderType === 'dine-in' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('dine-in')}
                  className={orderType === 'dine-in' ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Home className="h-4 w-4 mr-1" />
                  داخل المطعم
                </Button>
                <Button
                  variant={orderType === 'takeaway' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('takeaway')}
                  className={orderType === 'takeaway' ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  تيك أواي
                </Button>
                <Button
                  variant={orderType === 'delivery' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('delivery')}
                  className={orderType === 'delivery' ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  دليفري
                </Button>
              </div>
            </div>

            {/* Table/Driver Selection */}
            {orderType === 'dine-in' && (
              <div className="space-y-2">
                <Label>اختيار الطاولة</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طاولة متاحة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        طاولة {table.number} - {table.capacity} أشخاص
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTable && (
                  <p className="text-sm text-green-600">
                    ✓ تم اختيار طاولة {tables.find(t => t.id === selectedTable)?.number}
                  </p>
                )}
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="space-y-2">
                <Label>اختيار الطيار</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طيار متاح" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicleType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDriver && (
                  <p className="text-sm text-green-600">
                    ✓ تم اختيار الطيار {drivers.find(d => d.id === selectedDriver)?.name}
                  </p>
                )}
              </div>
            )}
            
            {/* Cart Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">السلة فارغة</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price} ج.م</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <Separator />
                
                {/* Discount */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">خصم %:</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20"
                  />
                </div>

                {/* Bill Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم ({discount}%):</span>
                      <span>-{discountAmount.toFixed(2)} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>الضريبة ({taxRate}%):</span>
                    <span>{taxAmount.toFixed(2)} ج.م</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span className="text-orange-600">{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={() => handleCheckout('cash')}
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    دفع نقدي
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCheckout('card')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    دفع بالبطاقة
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => printInvoice()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    طباعة الفاتورة
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Selection Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>اختيار الطاولة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">يرجى اختيار طاولة متاحة لإتمام الطلب</p>
            <div className="grid grid-cols-2 gap-2">
              {availableTables.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable === table.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTable(table.id);
                    setShowTableDialog(false);
                  }}
                  className="h-16 flex flex-col"
                >
                  <Users className="h-4 w-4 mb-1" />
                  <span>طاولة {table.number}</span>
                  <span className="text-xs">{table.capacity} أشخاص</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Driver Selection Dialog */}
      <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>اختيار الطيار</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">يرجى اختيار طيار متاح لتوصيل الطلب</p>
            <div className="space-y-2">
              {availableDrivers.map((driver) => (
                <Button
                  key={driver.id}
                  variant={selectedDriver === driver.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedDriver(driver.id);
                    setShowDriverDialog(false);
                  }}
                  className="w-full justify-start"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  <span>{driver.name} - {driver.vehicleType}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;