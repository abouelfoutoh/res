import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MenuIcon, 
  Search, 
  Star,
  Heart,
  Eye,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  preparationTime: number; // minutes
  calories?: number;
  ingredients: string[];
  allergens: string[];
}

const Menu = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Mock menu data with Egyptian prices
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'شاورما لحم ',
      description: 'شاورما لحم طازج مطبوخ على الفحم مع الخضار الطازجة والصلصة الخاصة، يقدم في خبز عربي طازج',
      price: 45,
      category: 'main',
      isAvailable: true,
      isFeatured: true,
      isPopular: true,
      preparationTime: 8,
      calories: 420,
      ingredients: ['لحم غنم', 'خبز عربي', 'طماطم', 'خيار', 'بقدونس', 'طحينة'],
      allergens: ['الجلوتين', 'السمسم']
    },
    {
      id: '2',
      name: 'فروج مشوي كامل',
      description: 'فروج مشوي على الفحم مع التتبيلة الشامية الخاصة، يقدم مع الأرز الأبيض والسلطة',
      price: 65,
      category: 'main',
      isAvailable: true,
      isFeatured: true,
      isPopular: false,
      preparationTime: 25,
      calories: 650,
      ingredients: ['فروج طازج', 'أرز بسمتي', 'بهارات شامية', 'ليمون', 'ثوم'],
      allergens: []
    },
    {
      id: '3',
      name: 'كباب مشكل شامي',
      description: 'كباب لحم وكفتة مشكل مشوي على الفحم مع البرغل والسلطة والطحينة',
      price: 85,
      category: 'main',
      isAvailable: true,
      isFeatured: true,
      isPopular: true,
      preparationTime: 20,
      calories: 580,
      ingredients: ['لحم غنم مفروم', 'برغل', 'بقدونس', 'بصل', 'طحينة'],
      allergens: ['السمسم']
    },
    {
      id: '4',
      name: 'فتوش شامي أصيل',
      description: 'فتوش بالخضار الطازجة والخبز المحمص مع دبس الرمان وزيت الزيتون البكر',
      price: 25,
      category: 'salad',
      isAvailable: true,
      isFeatured: false,
      isPopular: true,
      preparationTime: 5,
      calories: 180,
      ingredients: ['خس', 'طماطم', 'خيار', 'فجل', 'نعنع', 'سماق', 'دبس رمان'],
      allergens: ['الجلوتين']
    },
    {
      id: '5',
      name: 'تبولة لبنانية',
      description: 'تبولة بالبقدونس الطازج والطماطم والبرغل الناعم مع عصير الليمون وزيت الزيتون',
      price: 20,
      category: 'salad',
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      preparationTime: 10,
      calories: 120,
      ingredients: ['بقدونس', 'طماطم', 'برغل ناعم', 'بصل أخضر', 'ليمون', 'زيت زيتون'],
      allergens: ['الجلوتين']
    },
    {
      id: '6',
      name: 'حمص بطحينة فاخر',
      description: 'حمص كريمي بالطحينة وزيت الزيتون البكر مع الصنوبر والبقدونس، يقدم مع الخبز العربي',
      price: 18,
      category: 'appetizer',
      isAvailable: true,
      isFeatured: false,
      isPopular: true,
      preparationTime: 5,
      calories: 220,
      ingredients: ['حمص', 'طحينة', 'ليمون', 'ثوم', 'زيت زيتون', 'صنوبر'],
      allergens: ['السمسم']
    },
    {
      id: '7',
      name: 'متبل باذنجان مدخن',
      description: 'متبل باذنجان مشوي على الفحم بالطحينة والرمان، يقدم مع الخبز العربي الطازج',
      price: 15,
      category: 'appetizer',
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      preparationTime: 15,
      calories: 160,
      ingredients: ['باذنجان', 'طحينة', 'ليمون', 'ثوم', 'رمان', 'بقدونس'],
      allergens: ['السمسم']
    },
    {
      id: '8',
      name: 'عصير ليمون نعنع طازج',
      description: 'عصير ليمون طازج بالنعنع والسكر، منعش ومثلج',
      price: 12,
      category: 'drinks',
      isAvailable: true,
      isFeatured: false,
      isPopular: true,
      preparationTime: 3,
      calories: 45,
      ingredients: ['ليمون طازج', 'نعنع', 'سكر', 'ثلج'],
      allergens: []
    },
    {
      id: '9',
      name: 'شاي أحمر سادة',
      description: 'شاي أحمر تركي أصيل، يقدم بالإستكان التقليدي مع السكر',
      price: 8,
      category: 'drinks',
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      preparationTime: 5,
      calories: 20,
      ingredients: ['شاي أحمر', 'سكر'],
      allergens: []
    },
    {
      id: '10',
      name: 'قهوة عربية بالهيل',
      description: 'قهوة عربية تقليدية بالهيل والزعفران، تقدم مع التمر',
      price: 10,
      category: 'drinks',
      isAvailable: false,
      isFeatured: false,
      isPopular: false,
      preparationTime: 8,
      calories: 15,
      ingredients: ['قهوة عربية', 'هيل', 'زعفران'],
      allergens: []
    },
    {
      id: '11',
      name: 'كنافة نابلسية',
      description: 'كنافة بالجبن النابلسي الطازج مع القطر والفستق الحلبي المقشر',
      price: 30,
      category: 'dessert',
      isAvailable: true,
      isFeatured: true,
      isPopular: true,
      preparationTime: 12,
      calories: 380,
      ingredients: ['كنافة', 'جبن نابلسي', 'قطر', 'فستق حلبي', 'سمن'],
      allergens: ['الجلوتين', 'الألبان', 'المكسرات']
    },
    {
      id: '12',
      name: 'مهلبية بالورد',
      description: 'مهلبية كريمية بماء الورد والفستق المقشر، حلوى شامية تقليدية',
      price: 22,
      category: 'dessert',
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      preparationTime: 5,
      calories: 240,
      ingredients: ['حليب', 'نشا', 'سكر', 'ماء ورد', 'فستق'],
      allergens: ['الألبان', 'المكسرات']
    }
  ]);

  const categories = [
    { id: 'all', name: 'جميع الأصناف', icon: '🍽️' },
    { id: 'main', name: 'الأطباق الرئيسية', icon: '🥘' },
    { id: 'appetizer', name: 'المقبلات', icon: '🥗' },
    { id: 'salad', name: 'السلطات', icon: '🥙' },
    { id: 'drinks', name: 'المشروبات', icon: '🥤' },
    { id: 'dessert', name: 'الحلويات', icon: '🍰' },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesFeatured = !showFeaturedOnly || item.isFeatured;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : '🍽️';
  };

  // Statistics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.isAvailable).length;
  const featuredItems = menuItems.filter(item => item.isFeatured).length;
  const popularItems = menuItems.filter(item => item.isPopular).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MenuIcon className="h-8 w-8 text-orange-600" />
            قائمة الطعام
          </h1>
          <p className="text-gray-600 mt-2">تصفح المنيو</p>
        </div>
        {user?.role === 'admin' && (
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="h-4 w-4 mr-2" />
            إضافة صنف جديد
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الأصناف</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <MenuIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأصناف المتاحة</p>
                <p className="text-2xl font-bold text-green-600">{availableItems}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأصناف المميزة</p>
                <p className="text-2xl font-bold text-yellow-600">{featuredItems}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأصناف الشائعة</p>
                <p className="text-2xl font-bold text-red-600">{popularItems}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
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
                placeholder="البحث في القائمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={showFeaturedOnly ? "bg-gradient-to-r from-yellow-500 to-yellow-600" : ""}
            >
              <Star className="h-4 w-4 mr-1" />
              المميزة فقط
            </Button>
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
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`hover:shadow-lg transition-shadow relative ${
            !item.isAvailable ? 'opacity-75 bg-gray-50' : ''
          }`}>
            {item.isFeatured && (
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-yellow-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  مميز
                </Badge>
              </div>
            )}
            
            {item.isPopular && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-red-500 text-white">
                  <Heart className="h-3 w-3 mr-1" />
                  شائع
                </Badge>
              </div>
            )}

            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">{getCategoryIcon(item.category)}</span>
                </div>

                {/* Item Info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                    <Badge variant="outline" className="mr-2">
                      {getCategoryName(item.category)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.description}</p>

                  {/* Price and Details */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">{item.price} ج.م</span>
                    <div className="text-right text-sm text-gray-600">
                      <p>وقت التحضير: {item.preparationTime} دقيقة</p>
                      {item.calories && <p>السعرات: {item.calories} كالوري</p>}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? 'متاح' : 'غير متاح'}
                    </Badge>
                  </div>

                  {/* Ingredients */}
                  <div className="mb-3">
                    <h4 className="font-medium text-sm mb-2">المكونات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.slice(0, 4).map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                      {item.ingredients.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.ingredients.length - 4} أخرى
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Allergens */}
                  {item.allergens.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-sm mb-2 text-red-600">تحذيرات الحساسية:</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen, index) => (
                          <Badge key={index} className="bg-red-100 text-red-800 text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500"
                      disabled={!item.isAvailable || user?.role === 'cashier'}
                    >
                      {user?.role === 'cashier' ? 'للعرض فقط' : item.isAvailable ? 'إضافة للطلب' : 'غير متاح'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MenuIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أصناف</h3>
            <p className="text-gray-600">لم يتم العثور على أصناف تطابق البحث الحالي</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Menu;
