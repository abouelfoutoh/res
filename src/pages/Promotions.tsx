import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Tag,
  Percent,
  Calendar,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_one_get_one';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProducts: string[];
  minPurchase?: number;
}

const Promotions = () => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'خصم الصيف',
      description: 'خصم 20% على جميع الأطباق الرئيسية',
      type: 'percentage',
      value: 20,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isActive: true,
      applicableProducts: ['main'],
      minPurchase: 50
    },
    {
      id: '2',
      name: 'اشتري واحد واحصل على آخر',
      description: 'اشتري مشروب واحصل على آخر مجاناً',
      type: 'buy_one_get_one',
      value: 1,
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      isActive: true,
      applicableProducts: ['drinks']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    applicableProducts: [],
    minPurchase: 0
  });

  const filteredPromotions = promotions.filter(promotion =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addPromotion = () => {
    if (!newPromotion.name || !newPromotion.description) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const promotion: Promotion = {
      id: Date.now().toString(),
      name: newPromotion.name!,
      description: newPromotion.description!,
      type: newPromotion.type!,
      value: newPromotion.value!,
      startDate: newPromotion.startDate!,
      endDate: newPromotion.endDate!,
      isActive: newPromotion.isActive!,
      applicableProducts: newPromotion.applicableProducts!,
      minPurchase: newPromotion.minPurchase
    };

    setPromotions([...promotions, promotion]);
    setNewPromotion({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      applicableProducts: [],
      minPurchase: 0
    });
    setIsAddingPromotion(false);

    toast({
      title: "تم إضافة العرض",
      description: "تم إضافة العرض الترويجي بنجاح"
    });
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(promotion =>
      promotion.id === id 
        ? { ...promotion, isActive: !promotion.isActive }
        : promotion
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
    toast({
      title: "تم حذف العرض",
      description: "تم حذف العرض الترويجي بنجاح"
    });
  };

  const applyPromotion = (promotion: Promotion) => {
    toast({
      title: `تم طلب العرض: ${promotion.name}`,
      description: promotion.description,
      variant: "default"
    });

    // يمكنك هنا إضافة منطق إضافي مثل ربط العرض بفاتورة الطلب
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              العروض الترويجية
            </span>
            <Button 
              onClick={() => setIsAddingPromotion(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة عرض جديد
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في العروض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {isAddingPromotion && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="اسم العرض"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                  />
                  <Input
                    placeholder="وصف العرض"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                  />
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value as 'percentage' | 'fixed' | 'buy_one_get_one'})}
                  >
                    <option value="percentage">خصم بالنسبة المئوية</option>
                    <option value="fixed">خصم ثابت</option>
                    <option value="buy_one_get_one">اشتري واحد واحصل على آخر</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="قيمة الخصم"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({...newPromotion, value: Number(e.target.value)})}
                  />
                  <Input
                    type="date"
                    placeholder="تاريخ البداية"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                  />
                  <Input
                    type="date"
                    placeholder="تاريخ النهاية"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addPromotion} className="bg-green-600 hover:bg-green-700">
                    حفظ العرض
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingPromotion(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{promotion.name}</h3>
                      <p className="text-sm text-gray-600">{promotion.description}</p>
                    </div>
                    <Badge variant={promotion.isActive ? "default" : "secondary"}>
                      {promotion.isActive ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">
                        {promotion.type === 'percentage' && `${promotion.value}%`}
                        {promotion.type === 'fixed' && `${promotion.value} ج.م`}
                        {promotion.type === 'buy_one_get_one' && 'اشتري واحد واحصل على آخر'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">
                        {new Date(promotion.startDate).toLocaleDateString('ar-EG')} - {new Date(promotion.endDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={promotion.isActive ? "outline" : "default"}
                      onClick={() => togglePromotionStatus(promotion.id)}
                      className="flex-1"
                    >
                      {promotion.isActive ? "إيقاف" : "تفعيل"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePromotion(promotion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => applyPromotion(promotion)}
                  >
                    طلب هذا العرض
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد عروض متاحة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Promotions;
