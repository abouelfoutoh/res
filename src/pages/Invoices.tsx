import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Search, 
  Calendar,
  DollarSign,
  Eye,
  Printer,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'paid' | 'pending' | 'cancelled';
  cashierName: string;
  notes?: string;
}

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [showCreateForm, setShowCreateForm] = useState(false);



  // Mock invoices data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'أحمد محمد سالم',
      customerPhone: '+966501234567',
      date: new Date(),
      items: [
        { id: '1', name: 'شاورما لحم', quantity: 2, price: 25, total: 50 },
        { id: '2', name: 'عصير برتقال', quantity: 1, price: 8, total: 8 }
      ],
      subtotal: 58,
      tax: 8.7,
      discount: 5,
      total: 61.7,
      paymentMethod: 'cash',
      status: 'paid',
      cashierName: 'سارة أحمد',
      notes: 'عميل مميز'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'فاطمة علي أحمد',
      customerPhone: '+966507654321',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      items: [
        { id: '1', name: 'فروج مشوي', quantity: 1, price: 35, total: 35 },
        { id: '2', name: 'تبولة', quantity: 1, price: 12, total: 12 }
      ],
      subtotal: 47,
      tax: 7.05,
      discount: 0,
      total: 54.05,
      paymentMethod: 'card',
      status: 'paid',
      cashierName: 'محمد سالم'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'خالد سالم',
      customerPhone: '+966509876543',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      items: [
        { id: '1', name: 'كباب مشكل', quantity: 1, price: 45, total: 45 }
      ],
      subtotal: 45,
      tax: 6.75,
      discount: 0,
      total: 51.75,
      paymentMethod: 'transfer',
      status: 'pending',
      cashierName: 'علي محمد'
    }
  ]);

  const statusOptions = [
    { id: 'all', name: 'جميع الحالات' },
    { id: 'paid', name: 'مدفوعة' },
    { id: 'pending', name: 'في الانتظار' },
    { id: 'cancelled', name: 'ملغية' },
  ];

  const paymentOptions = [
    { id: 'all', name: 'جميع طرق الدفع' },
    { id: 'cash', name: 'نقدي' },
    { id: 'card', name: 'بطاقة' },
    { id: 'transfer', name: 'تحويل' },
  ];

  const dateOptions = [
    { id: 'today', name: 'اليوم' },
    { id: 'week', name: 'هذا الأسبوع' },
    { id: 'month', name: 'هذا الشهر' },
    { id: 'all', name: 'جميع التواريخ' },
  ];

  const getStatusColor = (status: Invoice['status']) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  const getStatusName = (status: Invoice['status']) => {
    const names = {
      paid: 'مدفوعة',
      pending: 'في الانتظار',
      cancelled: 'ملغية',
    };
    return names[status];
  };

  const getPaymentName = (method: Invoice['paymentMethod']) => {
    const names = {
      cash: 'نقدي',
      card: 'بطاقة',
      transfer: 'تحويل',
    };
    return names[method];
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>فاتورة ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-details { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
              .items-table th { background-color: #f2f2f2; }
              .total-section { margin-top: 20px; }
              .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
              .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>مطعم ابوالفتوح للمأ:ولات الشامية</h1>
              <p>القاهرة، مصر</p>
              <h2>فاتورة رقم: ${invoice.invoiceNumber}</h2>
            </div>
            
            <div class="invoice-details">
              <p><strong>العميل:</strong> ${invoice.customerName}</p>
              <p><strong>الهاتف:</strong> ${invoice.customerPhone}</p>
              <p><strong>التاريخ:</strong> ${invoice.date.toLocaleDateString('ar-SA')}</p>
              <p><strong>الوقت:</strong> ${invoice.date.toLocaleTimeString('ar-SA')}</p>
              <p><strong>الكاشير:</strong> ${invoice.cashierName}</p>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} ج.م</td>
                    <td>${item.total.toFixed(2)} ج.م</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <div class="total-row">
                <span>المجموع الفرعي:</span>
                <span>${invoice.subtotal.toFixed(2)} ج.م</span>
              </div>
              ${invoice.discount > 0 ? `
                <div class="total-row">
                  <span>الخصم:</span>
                  <span>-${invoice.discount.toFixed(2)} ج.م</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>الضريبة (15%):</span>
                <span>${invoice.tax.toFixed(2)} ج.م</span>
              </div>
              <div class="total-row total-final">
                <span>الإجمالي النهائي:</span>
                <span>${invoice.total.toFixed(2)} ج.م</span>
              </div>
              <div class="total-row">
                <span>طريقة الدفع:</span>
                <span>${getPaymentName(invoice.paymentMethod)}</span>
              </div>
            </div>
            
            ${invoice.notes ? `<p><strong>ملاحظات:</strong> ${invoice.notes}</p>` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <p>شكراً لزيارتكم</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerPhone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesPayment = selectedPayment === 'all' || invoice.paymentMethod === selectedPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const avgInvoiceValue = totalInvoices > 0 ? totalRevenue / paidInvoices : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-orange-600" />
            إدارة الفواتير
          </h1>
          <p className="text-gray-600 mt-2">عرض وإدارة جميع الفواتير</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير Excel
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500">
            <Plus className="h-4 w-4 mr-2" />
            فاتورة جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
                <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">فواتير مدفوعة</p>
                <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
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
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط قيمة الفاتورة</p>
                <p className="text-2xl font-bold text-orange-600">{avgInvoiceValue.toFixed(0)} ج.م</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
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
                placeholder="البحث برقم الفاتورة أو اسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">حالة الفاتورة:</label>
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
              <label className="text-sm font-medium mb-2 block">طريقة الدفع:</label>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((payment) => (
                  <Button
                    key={payment.id}
                    variant={selectedPayment === payment.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPayment(payment.id)}
                    className={selectedPayment === payment.id ? 
                      "bg-gradient-to-r from-blue-500 to-blue-600" : ""
                    }
                  >
                    {payment.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">التاريخ:</label>
              <div className="flex flex-wrap gap-2">
                {dateOptions.map((date) => (
                  <Button
                    key={date.id}
                    variant={dateFilter === date.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateFilter(date.id)}
                    className={dateFilter === date.id ? 
                      "bg-gradient-to-r from-green-500 to-green-600" : ""
                    }
                  >
                    {date.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>الفواتير ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الفاتورة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الإجمالي</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الكاشير</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono font-bold">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.customerName}</p>
                      <p className="text-sm text-gray-600" dir="ltr">{invoice.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{invoice.date.toLocaleDateString('ar-SA')}</p>
                      <p className="text-sm text-gray-600">{invoice.date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">{invoice.total.toFixed(2)} ج.م</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getPaymentName(invoice.paymentMethod)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusName(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.cashierName}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePrintInvoice(invoice)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteInvoice(invoice.id)}
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

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد فواتير</h3>
              <p className="text-gray-600">لم يتم العثور على فواتير تطابق البحث الحالي</p>
            </div>
          )}
        </CardContent>
      </Card>

      
      
    </div>
  );
};

export default Invoices;
