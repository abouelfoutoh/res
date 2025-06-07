import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Partial<Customer>) => void;
  customer?: Customer | null;
}

export const CustomerFormDialog: React.FC<CustomerFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  customer
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم العميل *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="أدخل اسم العميل"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="01xxxxxxxxx"
              required
              dir="ltr"
            />
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="أدخل عنوان العميل"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600">
              {customer ? 'تحديث' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
