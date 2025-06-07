import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Star
} from 'lucide-react';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  description: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  minStock: number;
}

const Products = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  
  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'شاورما لحم',
      price: 45,
      cost: 25,
      category: 'main',
      description: 'شاورما لحم طازج مع الخضار والصلصة',
      isActive: true,
      isFeatured: true,
      stock: 50,
      minStock: 10
    },
    {
      id: '2',
      name: 'فروج مشوي',
      price: 65,
      cost: 35,
      category: 'main',
      description: 'فروج مشوي كامل مع التتبيلة الخاصة',
      isActive: true,
      isFeatured: false,
      stock: 25,
      minStock: 5
    },
    {
      id: '3',
      name: 'كباب مشكل',
      price: 85,
      cost: 48,
      category: 'main',
      description: 'كباب لحم وكفتة مشكل مع الأرز',
      isActive: true,
      isFeatured: true,
      stock: 30,
      minStock: 8
    },
    {
      id: '4',
      name: 'فتوش',
      price: 25,
      cost: 12,
      category: 'salad',
      description: 'فتوش بالخضار الطازجة والخبز المحمص',
      isActive: true,
      isFeatured: false,
      stock: 40,
      minStock: 15
    },
    {
      id: '5',
      name: 'تبولة',
      price: 20,
      cost: 10,
      category: 'salad',
      description: 'تبولة بالبقدونس والطماطم والبرغل',
      isActive: true,
      isFeatured: false,
      stock: 35,
      minStock: 12
    },
    {
      id: '6',
      name: 'حمص بطحينة',
      price: 18,
      cost: 8,
      category: 'appetizer',
      description: 'حمص كريمي بالطحينة وزيت الزيتون',
      isActive: true,
      isFeatured: false,
      stock: 60,
      minStock: 20
    },
    {
      id: '7',
      name: 'متبل',
      price: 15,
      cost: 7,
      category: 'appetizer',
      description: 'متبل باذنجان مشوي بالطحينة',
      isActive: false,
      isFeatured: false,
      stock: 15,
      minStock: 10
    },
    {
      id: '8',
      name: 'عصير برتقال',
      price: 12,
      cost: 5,
      category: 'drinks',
      description: 'عصير برتقال طازج طبيعي 100%',
      isActive: true,
      isFeatured: false,
      stock: 80,
      minStock: 30
    }
  ]);

  const categories = [
    { id: 'all', name: 'جميع المنتجات' },
    { id: 'main', name: 'الأطباق الرئيسية' },
    { id: 'appetizer', name: 'المقبلات' },
    { id: 'salad', name: 'السلطات' },
    { id: 'drinks', name: 'المشروبات' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح",
    });
  };

  const handleSaveProduct = (productData: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) {
      return { status: 'low', color: 'bg-red-100 text-red-800', text: 'مخزون منخفض' };
    } else if (product.stock <= product.minStock * 2) {
      return { status: 'medium', color: 'bg-yellow-100 text-yellow-800', text: 'مخزون متوسط' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', text: 'مخزون جيد' };
    }
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-orange-600" />
            إدارة المنتجات
          </h1>
          <p className="text-gray-600 mt-2">إدارة منتجات المطعم والقائمة</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={handleAddProduct}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات النشطة</p>
                <p className="text-2xl font-bold text-green-600">{activeProducts}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات المميزة</p>
                <p className="text-2xl font-bold text-yellow-600">{featuredProducts}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
              </div>
              <Trash2 className="h-8 w-8 text-red-600" />
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
                placeholder="البحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
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

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const profit = product.price - product.cost;
          const profitMargin = ((profit / product.price) * 100).toFixed(1);
          
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow relative">
              {product.isFeatured && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    مميز
                  </Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Product Image Placeholder */}
                  <div className="h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🍽️</span>
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{getCategoryName(product.category)}</Badge>
                      <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">سعر البيع:</span>
                        <span className="font-bold text-green-600">{product.price} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">التكلفة:</span>
                        <span className="font-medium text-gray-800">{product.cost} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الربح:</span>
                        <span className="font-bold text-orange-600">{profit} ج.م ({profitMargin}%)</span>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">المخزون:</span>
                        <span className="font-medium">{product.stock} وحدة</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            product.stock <= product.minStock ? 'bg-red-500' :
                            product.stock <= product.minStock * 2 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((product.stock / (product.minStock * 3)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">لم يتم العثور على منتجات تطابق البحث الحالي</p>
          </CardContent>
        </Card>
      )}

      <ProductFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;
