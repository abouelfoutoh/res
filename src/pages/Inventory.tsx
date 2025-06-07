import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Warehouse, 
  Plus, 
  Search, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Package,
  ShoppingCart,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  description?: string;
}

const Inventory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'grains',
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    unit: 'كيلو',
    costPerUnit: 0,
    supplier: '',
    description: ''
  });

  // Mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'أرز بسمتي',
      category: 'grains',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'كيلو',
      costPerUnit: 12,
      supplier: 'شركة الحبوب الذهبية',
      lastRestocked: new Date('2024-01-15'),
      expiryDate: new Date('2024-06-15'),
      description: 'أرز بسمتي هندي عالي الجودة'
    },
    {
      id: '2',
      name: 'دجاج مقطع',
      category: 'meat',
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: 'كيلو',
      costPerUnit: 55,
      supplier: 'مزارع الطازج',
      lastRestocked: new Date('2024-01-10'),
      expiryDate: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'طحينة',
      category: 'condiments',
      currentStock: 5,
      minStock: 8,
      maxStock: 30,
      unit: 'علبة',
      costPerUnit: 28,
      supplier: 'معمل الطحينة الشامية',
      lastRestocked: new Date('2024-01-12')
    },
    {
      id: '4',
      name: 'خضار مشكلة',
      category: 'vegetables',
      currentStock: 25,
      minStock: 15,
      maxStock: 60,
      unit: 'كيلو',
      costPerUnit: 15,
      supplier: 'سوق الخضار المركزي',
      lastRestocked: new Date('2024-01-16'),
      expiryDate: new Date('2024-01-25')
    },
    {
      id: '5',
      name: 'زيت زيتون',
      category: 'oils',
      currentStock: 12,
      minStock: 5,
      maxStock: 25,
      unit: 'لتر',
      costPerUnit: 85,
      supplier: 'مطابع الزيتون الفاخر',
      lastRestocked: new Date('2024-01-08')
    }
  ]);

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'meat', name: 'اللحوم' },
    { id: 'vegetables', name: 'الخضار' },
    { id: 'grains', name: 'الحبوب' },
    { id: 'condiments', name: 'التوابل والصلصات' },
    { id: 'oils', name: 'الزيوت' },
  ];

  const statusFilters = [
    { id: 'all', name: 'جميع العناصر' },
    { id: 'low', name: 'مخزون منخفض' },
    { id: 'normal', name: 'مخزون طبيعي' },
    { id: 'expiring', name: 'قريب الانتهاء' },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) {
      return { 
        status: 'low', 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'مخزون منخفض',
        icon: <AlertTriangle className="h-4 w-4" />
      };
    } else if (item.currentStock >= item.maxStock * 0.8) {
      return { 
        status: 'high', 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'مخزون عالي',
        icon: <TrendingUp className="h-4 w-4" />
      };
    } else {
      return { 
        status: 'normal', 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        text: 'مخزون طبيعي',
        icon: <Package className="h-4 w-4" />
      };
    }
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpiringSoon = (item: InventoryItem) => {
    const days = getDaysUntilExpiry(item.expiryDate);
    return days !== null && days <= 7;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (filterStatus === 'low') {
      matchesStatus = item.currentStock <= item.minStock;
    } else if (filterStatus === 'normal') {
      matchesStatus = item.currentStock > item.minStock && item.currentStock < item.maxStock * 0.8;
    } else if (filterStatus === 'expiring') {
      matchesStatus = isExpiringSoon(item);
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock).length;
  const expiringItems = inventory.filter(item => isExpiringSoon(item)).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setFormData({
      name: '',
      category: 'grains',
      currentStock: 0,
      minStock: 5,
      maxStock: 100,
      unit: 'كيلو',
      costPerUnit: 0,
      supplier: '',
      description: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier,
      description: item.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setInventory(inventory.filter(item => item.id !== itemId));
    toast({
      title: "تم حذف المادة",
      description: "تم حذف المادة من المخزون بنجاح",
    });
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.supplier || formData.costPerUnit! <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من إدخال جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      // Update existing item
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item,
              ...formData,
              lastRestocked: new Date()
            } as InventoryItem
          : item
      ));
      toast({
        title: "تم تحديث المادة",
        description: "تم تحديث بيانات المادة بنجاح",
      });
    } else {
      // Add new item
      const newItem: InventoryItem = {
        ...formData,
        id: Date.now().toString(),
        lastRestocked: new Date()
      } as InventoryItem;
      setInventory([...inventory, newItem]);
      toast({
        title: "تم إضافة المادة",
        description: "تم إضافة مادة جديدة للمخزون بنجاح",
      });
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Warehouse className="h-8 w-8 text-orange-600" />
            إدارة المخزون
          </h1>
          <p className="text-gray-600 mt-2">متابعة المواد الخام والمخزون</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة مادة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العناصر</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قريب الانتهاء</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringItems}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيمة المخزون</p>
                <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString()} ج.م</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
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
                placeholder="البحث في المخزون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">الفئات:</label>
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
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">حالة المخزون:</label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={filterStatus === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(filter.id)}
                    className={filterStatus === filter.id ? 
                      "bg-gradient-to-r from-blue-500 to-blue-600" : ""
                    }
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List with Edit/Delete buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
          const stockPercentage = (item.currentStock / item.maxStock) * 100;
          
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">{getCategoryName(item.category)}</p>
                    </div>
                    <Badge className={stockStatus.color}>
                      {stockStatus.icon}
                      <span className="mr-1">{stockStatus.text}</span>
                    </Badge>
                  </div>

                  {/* Stock Information */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">المخزون الحالي:</span>
                      <span className="font-bold text-lg">{item.currentStock} {item.unit}</span>
                    </div>

                    {/* Stock Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          item.currentStock <= item.minStock ? 'bg-red-500' :
                          item.currentStock >= item.maxStock * 0.8 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600">
                      <span>الحد الأدنى: {item.minStock}</span>
                      <span>الحد الأقصى: {item.maxStock}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">التكلفة/الوحدة:</span>
                      <span className="font-medium">{item.costPerUnit} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">القيمة الإجمالية:</span>
                      <span className="font-bold text-green-600">
                        {(item.currentStock * item.costPerUnit).toLocaleString()} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المورد:</span>
                      <span className="font-medium text-blue-600">{item.supplier}</span>
                    </div>
                  </div>

                  {/* Expiry Warning */}
                  {daysUntilExpiry !== null && (
                    <div className={`p-3 rounded-lg ${
                      daysUntilExpiry <= 3 ? 'bg-red-50 border border-red-200' :
                      daysUntilExpiry <= 7 ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${
                          daysUntilExpiry <= 3 ? 'text-red-600' :
                          daysUntilExpiry <= 7 ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          daysUntilExpiry <= 3 ? 'text-red-800' :
                          daysUntilExpiry <= 7 ? 'text-yellow-800' :
                          'text-green-800'
                        }`}>
                          {daysUntilExpiry <= 0 ? 'منتهي الصلاحية!' :
                           daysUntilExpiry === 1 ? 'ينتهي غداً' :
                           `ينتهي خلال ${daysUntilExpiry} أيام`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Last Restock */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    آخر تجديد: {item.lastRestocked.toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  تعديل
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عناصر</h3>
            <p className="text-gray-600">لم يتم العثور على عناصر تطابق البحث الحالي</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'تعديل المادة' : 'إضافة مادة جديدة'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المادة *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثال: أرز بسمتي"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <select
                  id="category"
                  value={formData.category || 'grains'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {categories.filter(cat => cat.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="وصف المادة..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">المخزون الحالي</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock || 0}
                  onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">الحد الأدنى</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock || 0}
                  onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">الحد الأقصى</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock || 0}
                  onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">الوحدة</Label>
                <Input
                  id="unit"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="كيلو / لتر / علبة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPerUnit">التكلفة/الوحدة (ج.م) *</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPerUnit || 0}
                  onChange={(e) => setFormData({...formData, costPerUnit: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">المورد *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier || ''}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  placeholder="اسم المورد"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveItem} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {editingItem ? 'تحديث' : 'إضافة'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
