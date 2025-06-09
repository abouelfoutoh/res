import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Truck,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Star,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'motorcycle' | 'car' | 'bicycle';
  vehicleNumber: string;
  status: 'available' | 'busy' | 'offline';
  currentOrder?: string;
  currentLocation?: string;
  totalDeliveries: number;
  rating: number;
  earnings: number;
  joinDate: string;
  notes?: string;
}

const DeliveryDrivers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DeliveryDriver | null>(null);

  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    vehicleType: 'motorcycle' as const,
    vehicleNumber: '',
    notes: ''
  });

  const [drivers, setDrivers] = useState<DeliveryDriver[]>([
    {
      id: '1',
      name: 'محمد أحمد',
      phone: '01234567890',
      vehicleType: 'motorcycle',
      vehicleNumber: 'ABC-123',
      status: 'busy',
      currentOrder: 'ORD-001',
      currentLocation: 'المعادي',
      totalDeliveries: 156,
      rating: 4.8,
      earnings: 2500,
      joinDate: '2024-01-15',
      notes: 'طيار ممتاز وسريع'
    },
    {
      id: '2',
      name: 'علي حسن',
      phone: '01234567891',
      vehicleType: 'motorcycle',
      vehicleNumber: 'XYZ-456',
      status: 'available',
      totalDeliveries: 89,
      rating: 4.5,
      earnings: 1800,
      joinDate: '2024-02-01',
      notes: 'يعرف المنطقة جيداً'
    },
    {
      id: '3',
      name: 'سارة محمد',
      phone: '01234567892',
      vehicleType: 'car',
      vehicleNumber: 'DEF-789',
      status: 'offline',
      totalDeliveries: 234,
      rating: 4.9,
      earnings: 3200,
      joinDate: '2023-12-10',
      notes: 'طيارة محترفة'
    },
    {
      id: '4',
      name: 'أحمد سالم',
      phone: '01234567893',
      vehicleType: 'bicycle',
      vehicleNumber: 'BIKE-001',
      status: 'available',
      totalDeliveries: 45,
      rating: 4.2,
      earnings: 800,
      joinDate: '2024-03-01',
      notes: 'للطلبات القريبة'
    }
  ]);

  const statusOptions = [
    { id: 'all', name: 'جميع الطيارين' },
    { id: 'available', name: 'متاح' },
    { id: 'busy', name: 'مشغول' },
    { id: 'offline', name: 'غير متصل' },
  ];

  const vehicleTypes = [
    { id: 'motorcycle', name: 'موتوسيكل', icon: '🏍️' },
    { id: 'car', name: 'سيارة', icon: '🚗' },
    { id: 'bicycle', name: 'دراجة', icon: '🚲' },
  ];

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || driver.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: DeliveryDriver['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-red-100 text-red-800 border-red-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status];
  };

  const getStatusIcon = (status: DeliveryDriver['status']) => {
    const icons = {
      available: <CheckCircle className="h-4 w-4" />,
      busy: <Clock className="h-4 w-4" />,
      offline: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status];
  };

  const getStatusName = (status: DeliveryDriver['status']) => {
    const names = {
      available: 'متاح',
      busy: 'مشغول',
      offline: 'غير متصل',
    };
    return names[status];
  };

  const getVehicleInfo = (vehicleType: DeliveryDriver['vehicleType']) => {
    const vehicle = vehicleTypes.find(v => v.id === vehicleType);
    return vehicle || { name: vehicleType, icon: '🚗' };
  };

  const handleAddDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.vehicleNumber) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const driver: DeliveryDriver = {
      id: Date.now().toString(),
      name: newDriver.name,
      phone: newDriver.phone,
      vehicleType: newDriver.vehicleType,
      vehicleNumber: newDriver.vehicleNumber,
      status: 'offline',
      totalDeliveries: 0,
      rating: 0,
      earnings: 0,
      joinDate: new Date().toISOString().split('T')[0],
      notes: newDriver.notes
    };
    
    setDrivers(prev => [...prev, driver]);
    setNewDriver({
      name: '',
      phone: '',
      vehicleType: 'motorcycle',
      vehicleNumber: '',
      notes: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة الطيار",
      description: "تم إضافة طيار جديد بنجاح",
    });
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    toast({
      title: "تم حذف الطيار",
      description: "تم حذف الطيار بنجاح",
    });
  };

  const handleUpdateDriver = () => {
    if (!editingDriver) return;
    
    setDrivers(prev => prev.map(d => d.id === editingDriver.id ? editingDriver : d));
    setEditingDriver(null);
    
    toast({
      title: "تم تحديث الطيار",
      description: "تم تحديث بيانات الطيار بنجاح",
    });
  };

  const changeDriverStatus = (id: string, newStatus: DeliveryDriver['status']) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id 
        ? { 
            ...driver, 
            status: newStatus,
            ...(newStatus === 'available' && {
              currentOrder: undefined,
              currentLocation: undefined
            })
          }
        : driver
    ));
    
    toast({
      title: "تم تغيير حالة الطيار",
      description: `تم تغيير حالة الطيار إلى ${getStatusName(newStatus)}`,
    });
  };

  // Statistics
  const availableDrivers = drivers.filter(d => d.status === 'available').length;
  const busyDrivers = drivers.filter(d => d.status === 'busy').length;
  const totalDeliveries = drivers.reduce((sum, d) => sum + d.totalDeliveries, 0);
  const averageRating = drivers.length > 0 ? drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="h-8 w-8 text-orange-600" />
            إدارة طياري الدليفري
          </h1>
          <p className="text-gray-600 mt-2">إدارة طياري التوصيل وحالتهم</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة طيار جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طيارين متاحين</p>
                <p className="text-2xl font-bold text-green-600">{availableDrivers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طيارين مشغولين</p>
                <p className="text-2xl font-bold text-red-600">{busyDrivers}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التوصيلات</p>
                <p className="text-2xl font-bold text-blue-600">{totalDeliveries}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
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
              <Star className="h-8 w-8 text-yellow-600" />
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
              placeholder="البحث بالاسم أو الهاتف أو رقم المركبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

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
        </CardContent>
      </Card>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => {
          const vehicleInfo = getVehicleInfo(driver.vehicleType);
          
          return (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{driver.name}</h3>
                    <Badge className={getStatusColor(driver.status)}>
                      {getStatusIcon(driver.status)}
                      <span className="mr-1">{getStatusName(driver.status)}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">{vehicleInfo.icon}</span>
                      <span>{vehicleInfo.name} - {driver.vehicleNumber}</span>
                    </div>
                    
                    {driver.currentOrder && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>طلب: {driver.currentOrder}</span>
                      </div>
                    )}
                    
                    {driver.currentLocation && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{driver.currentLocation}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">التوصيلات</p>
                      <p className="font-bold text-blue-600">{driver.totalDeliveries}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">التقييم</p>
                      <p className="font-bold text-yellow-600">{driver.rating} ⭐</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الأرباح:</span>
                      <span className="font-bold text-green-600">{driver.earnings} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الانضمام:</span>
                      <span className="font-medium">{new Date(driver.joinDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  {driver.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{driver.notes}</p>
                    </div>
                  )}

                  {/* Status Change Buttons */}
                  <div className="space-y-2">
                    {driver.status === 'offline' && (
                      <Button 
                        size="sm" 
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => changeDriverStatus(driver.id, 'available')}
                      >
                        تفعيل (متاح)
                      </Button>
                    )}
                    
                    {driver.status === 'available' && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => changeDriverStatus(driver.id, 'busy')}
                        >
                          مشغول
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => changeDriverStatus(driver.id, 'offline')}
                        >
                          غير متصل
                        </Button>
                      </div>
                    )}
                    
                    {driver.status === 'busy' && (
                      <Button 
                        size="sm" 
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() => changeDriverStatus(driver.id, 'available')}
                      >
                        إنهاء التوصيل
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setEditingDriver(driver)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add Driver Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة طيار جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">اسم الطيار</Label>
              <Input
                id="name"
                value={newDriver.name}
                onChange={(e) => setNewDriver(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم الطيار"
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={newDriver.phone}
                onChange={(e) => setNewDriver(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="رقم الهاتف"
              />
            </div>
            <div>
              <Label htmlFor="vehicleType">نوع المركبة</Label>
              <select 
                id="vehicleType"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newDriver.vehicleType}
                onChange={(e) => setNewDriver(prev => ({ ...prev, vehicleType: e.target.value as any }))}
              >
                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.icon} {vehicle.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="vehicleNumber">رقم المركبة</Label>
              <Input
                id="vehicleNumber"
                value={newDriver.vehicleNumber}
                onChange={(e) => setNewDriver(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                placeholder="رقم المركبة"
              />
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={newDriver.notes}
                onChange={(e) => setNewDriver(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddDriver} className="flex-1">
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

      {/* Edit Driver Dialog */}
      <Dialog open={!!editingDriver} onOpenChange={() => setEditingDriver(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل الطيار</DialogTitle>
          </DialogHeader>
          {editingDriver && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">اسم الطيار</Label>
                <Input
                  id="edit-name"
                  value={editingDriver.name}
                  onChange={(e) => setEditingDriver(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                  placeholder="اسم الطيار"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">رقم الهاتف</Label>
                <Input
                  id="edit-phone"
                  value={editingDriver.phone}
                  onChange={(e) => setEditingDriver(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <Label htmlFor="edit-vehicleType">نوع المركبة</Label>
                <select 
                  id="edit-vehicleType"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={editingDriver.vehicleType}
                  onChange={(e) => setEditingDriver(prev => prev ? ({ ...prev, vehicleType: e.target.value as any }) : null)}
                >
                  {vehicleTypes.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.icon} {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-vehicleNumber">رقم المركبة</Label>
                <Input
                  id="edit-vehicleNumber"
                  value={editingDriver.vehicleNumber}
                  onChange={(e) => setEditingDriver(prev => prev ? ({ ...prev, vehicleNumber: e.target.value }) : null)}
                  placeholder="رقم المركبة"
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Textarea
                  id="edit-notes"
                  value={editingDriver.notes || ''}
                  onChange={(e) => setEditingDriver(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                  placeholder="ملاحظات إضافية"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateDriver} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التعديلات
                </Button>
                <Button variant="outline" onClick={() => setEditingDriver(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طيارين</h3>
            <p className="text-gray-600">لم يتم العثور على طيارين يطابقون البحث الحالي</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryDrivers;