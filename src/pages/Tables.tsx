import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: string;
  customerName?: string;
  occupiedSince?: Date;
  location: string;
  notes?: string;
}

const Tables = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 4,
    location: '',
    notes: ''
  });

  const [tables, setTables] = useState<Table[]>([
    {
      id: '1',
      number: '1',
      capacity: 4,
      status: 'occupied',
      currentOrder: 'ORD-001',
      customerName: 'أحمد محمد',
      occupiedSince: new Date(Date.now() - 45 * 60 * 1000),
      location: 'الصالة الرئيسية',
      notes: 'طاولة بجانب النافذة'
    },
    {
      id: '2',
      number: '2',
      capacity: 2,
      status: 'available',
      location: 'الصالة الرئيسية'
    },
    {
      id: '3',
      number: '3',
      capacity: 6,
      status: 'reserved',
      customerName: 'فاطمة علي',
      location: 'الصالة الرئيسية',
      notes: 'حجز لساعة 7 مساءً'
    },
    {
      id: '4',
      number: '4',
      capacity: 4,
      status: 'cleaning',
      location: 'الصالة الرئيسية'
    },
    {
      id: '5',
      number: '5',
      capacity: 8,
      status: 'available',
      location: 'الصالة الخاصة',
      notes: 'طاولة كبيرة للعائلات'
    }
  ]);

  const statusOptions = [
    { id: 'all', name: 'جميع الطاولات' },
    { id: 'available', name: 'متاحة' },
    { id: 'occupied', name: 'مشغولة' },
    { id: 'reserved', name: 'محجوزة' },
    { id: 'cleaning', name: 'تنظيف' },
  ];

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.includes(searchTerm) ||
                         table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (table.customerName && table.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || table.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Table['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      occupied: 'bg-red-100 text-red-800 border-red-200',
      reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cleaning: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Table['status']) => {
    const icons = {
      available: <CheckCircle className="h-4 w-4" />,
      occupied: <Users className="h-4 w-4" />,
      reserved: <Clock className="h-4 w-4" />,
      cleaning: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status];
  };

  const getStatusName = (status: Table['status']) => {
    const names = {
      available: 'متاحة',
      occupied: 'مشغولة',
      reserved: 'محجوزة',
      cleaning: 'تنظيف',
    };
    return names[status];
  };

  const handleAddTable = () => {
    if (!newTable.number || !newTable.location) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const table: Table = {
      id: Date.now().toString(),
      number: newTable.number,
      capacity: newTable.capacity,
      status: 'available',
      location: newTable.location,
      notes: newTable.notes
    };
    
    setTables(prev => [...prev, table]);
    setNewTable({
      number: '',
      capacity: 4,
      location: '',
      notes: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "تم إضافة الطاولة",
      description: "تم إضافة طاولة جديدة بنجاح",
    });
  };

  const handleDeleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
    toast({
      title: "تم حذف الطاولة",
      description: "تم حذف الطاولة بنجاح",
    });
  };

  const handleUpdateTable = () => {
    if (!editingTable) return;
    
    setTables(prev => prev.map(t => t.id === editingTable.id ? editingTable : t));
    setEditingTable(null);
    
    toast({
      title: "تم تحديث الطاولة",
      description: "تم تحديث بيانات الطاولة بنجاح",
    });
  };

  const changeTableStatus = (id: string, newStatus: Table['status']) => {
    setTables(prev => prev.map(table => 
      table.id === id 
        ? { 
            ...table, 
            status: newStatus,
            ...(newStatus === 'available' && {
              currentOrder: undefined,
              customerName: undefined,
              occupiedSince: undefined
            })
          }
        : table
    ));
    
    toast({
      title: "تم تغيير حالة الطاولة",
      description: `تم تغيير حالة الطاولة إلى ${getStatusName(newStatus)}`,
    });
  };

  const getOccupiedTime = (occupiedSince?: Date) => {
    if (!occupiedSince) return '';
    const minutes = Math.floor((Date.now() - occupiedSince.getTime()) / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ساعة${remainingMinutes > 0 ? ` و ${remainingMinutes} دقيقة` : ''}`;
    }
  };

  // Statistics
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-600" />
            إدارة الطاولات
          </h1>
          <p className="text-gray-600 mt-2">إدارة طاولات المطعم وحالتها</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة طاولة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طاولات متاحة</p>
                <p className="text-2xl font-bold text-green-600">{availableTables}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طاولات مشغولة</p>
                <p className="text-2xl font-bold text-red-600">{occupiedTables}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">طاولات محجوزة</p>
                <p className="text-2xl font-bold text-yellow-600">{reservedTables}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المقاعد</p>
                <p className="text-2xl font-bold text-blue-600">{totalCapacity}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
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
              placeholder="البحث برقم الطاولة أو الموقع أو اسم العميل..."
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

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <Card key={table.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl">طاولة {table.number}</h3>
                  <Badge className={getStatusColor(table.status)}>
                    {getStatusIcon(table.status)}
                    <span className="mr-1">{getStatusName(table.status)}</span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">السعة:</span>
                    <span className="font-medium">{table.capacity} أشخاص</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الموقع:</span>
                    <span className="font-medium">{table.location}</span>
                  </div>
                  
                  {table.customerName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">العميل:</span>
                      <span className="font-medium">{table.customerName}</span>
                    </div>
                  )}
                  
                  {table.currentOrder && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">رقم الطلب:</span>
                      <span className="font-medium">{table.currentOrder}</span>
                    </div>
                  )}
                  
                  {table.occupiedSince && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">مدة الإشغال:</span>
                      <span className="font-medium text-orange-600">{getOccupiedTime(table.occupiedSince)}</span>
                    </div>
                  )}
                </div>

                {table.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{table.notes}</p>
                  </div>
                )}

                {/* Status Change Buttons */}
                <div className="space-y-2">
                  {table.status === 'available' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => changeTableStatus(table.id, 'occupied')}
                      >
                        إشغال
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => changeTableStatus(table.id, 'reserved')}
                      >
                        حجز
                      </Button>
                    </div>
                  )}
                  
                  {table.status === 'occupied' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => changeTableStatus(table.id, 'available')}
                      >
                        تحرير
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => changeTableStatus(table.id, 'cleaning')}
                      >
                        تنظيف
                      </Button>
                    </div>
                  )}
                  
                  {(table.status === 'reserved' || table.status === 'cleaning') && (
                    <Button 
                      size="sm" 
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => changeTableStatus(table.id, 'available')}
                    >
                      جعل متاحة
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setEditingTable(table)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Table Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة طاولة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="number">رقم الطاولة</Label>
              <Input
                id="number"
                value={newTable.number}
                onChange={(e) => setNewTable(prev => ({ ...prev, number: e.target.value }))}
                placeholder="رقم الطاولة"
              />
            </div>
            <div>
              <Label htmlFor="capacity">السعة (عدد الأشخاص)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="20"
                value={newTable.capacity}
                onChange={(e) => setNewTable(prev => ({ ...prev, capacity: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={newTable.location}
                onChange={(e) => setNewTable(prev => ({ ...prev, location: e.target.value }))}
                placeholder="مثال: الصالة الرئيسية"
              />
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Input
                id="notes"
                value={newTable.notes}
                onChange={(e) => setNewTable(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddTable} className="flex-1">
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

      {/* Edit Table Dialog */}
      <Dialog open={!!editingTable} onOpenChange={() => setEditingTable(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل الطاولة</DialogTitle>
          </DialogHeader>
          {editingTable && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-number">رقم الطاولة</Label>
                <Input
                  id="edit-number"
                  value={editingTable.number}
                  onChange={(e) => setEditingTable(prev => prev ? ({ ...prev, number: e.target.value }) : null)}
                  placeholder="رقم الطاولة"
                />
              </div>
              <div>
                <Label htmlFor="edit-capacity">السعة (عدد الأشخاص)</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  max="20"
                  value={editingTable.capacity}
                  onChange={(e) => setEditingTable(prev => prev ? ({ ...prev, capacity: Number(e.target.value) }) : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">الموقع</Label>
                <Input
                  id="edit-location"
                  value={editingTable.location}
                  onChange={(e) => setEditingTable(prev => prev ? ({ ...prev, location: e.target.value }) : null)}
                  placeholder="مثال: الصالة الرئيسية"
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">ملاحظات</Label>
                <Input
                  id="edit-notes"
                  value={editingTable.notes || ''}
                  onChange={(e) => setEditingTable(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                  placeholder="ملاحظات إضافية"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateTable} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التعديلات
                </Button>
                <Button variant="outline" onClick={() => setEditingTable(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredTables.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طاولات</h3>
            <p className="text-gray-600">لم يتم العثور على طاولات تطابق البحث الحالي</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tables;