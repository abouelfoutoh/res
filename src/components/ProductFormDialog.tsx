
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id?: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  minStock: number;
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  onSave: (product: Product) => void;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onClose,
  product,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Product>(
    product || {
      name: '',
      price: 0,
      cost: 0,
      category: 'main',
      description: '',
      isActive: true,
      isFeatured: false,
      stock: 0,
      minStock: 5
    }
  );

  const categories = [
    { id: 'main', name: 'الأطباق الرئيسية' },
    { id: 'appetizer', name: 'المقبلات' },
    { id: 'salad', name: 'السلطات' },
    { id: 'drinks', name: 'المشروبات' },
    { id: 'dessert', name: 'الحلويات' },
  ];

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من إدخال اسم المنتج والسعر",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: product ? "تم تحديث المنتج" : "تم إضافة المنتج",
      description: product ? "تم تحديث المنتج بنجاح" : "تم إضافة منتج جديد بنجاح",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="مثال: شاورما لحم"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">التصنيف</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="وصف المنتج..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">سعر البيع (جنيه) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">التكلفة (جنيه)</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">المخزون الحالي</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">الحد الأدنى للمخزون</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">المنتج نشط</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">منتج مميز</Label>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {product ? 'تحديث' : 'إضافة'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
