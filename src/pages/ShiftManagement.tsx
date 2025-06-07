import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Play,
  Square,
  Edit2,
  Eye,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  employee: string;
  status: 'active' | 'completed' | 'scheduled';
  date: string;
  totalSales: number;
  transactionCount: number;
  openingCash: number;
  closingCash?: number;
  notes?: string;
}

const ShiftManagement = () => {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      name: 'شيفت الصباح',
      startTime: '08:00',
      endTime: '16:00',
      employee: 'أحمد محمد',
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      totalSales: 1250.50,
      transactionCount: 28,
      openingCash: 500,
      notes: 'شيفت عادي'
    },
    {
      id: '2',
      name: 'شيفت المساء',
      startTime: '16:00',
      endTime: '00:00',
      employee: 'فاطمة أحمد',
      status: 'scheduled',
      date: new Date().toISOString().split('T')[0],
      totalSales: 0,
      transactionCount: 0,
      openingCash: 500
    },
    {
      id: '3',
      name: 'شيفت الصباح',
      startTime: '08:00',
      endTime: '16:00',
      employee: 'محمد علي',
      status: 'completed',
      date: '2024-06-05',
      totalSales: 2150.75,
      transactionCount: 45,
      openingCash: 500,
      closingCash: 650,
      notes: 'شيفت ممتاز، مبيعات عالية'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: '',
    startTime: '',
    endTime: '',
    employee: '',
    openingCash: 500,
    notes: ''
  });

  const filteredShifts = shifts.filter(shift => shift.date === selectedDate);

  const startShift = (shiftId: string) => {
    setShifts(shifts.map(shift =>
      shift.id === shiftId
        ? { ...shift, status: 'active' as const }
        : shift
    ));
    toast({
      title: "تم بدء الشيفت",
      description: "تم بدء الشيفت بنجاح"
    });
  };

  const endShift = (shiftId: string, closingCash: number) => {
    setShifts(shifts.map(shift =>
      shift.id === shiftId
        ? { ...shift, status: 'completed' as const, closingCash, endTime: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }) }
        : shift
    ));
    toast({
      title: "تم إنهاء الشيفت",
      description: "تم إنهاء الشيفت وحفظ البيانات"
    });
  };

  const addNewShift = () => {
    if (!newShift.name || !newShift.startTime || !newShift.endTime || !newShift.employee) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const shift: Shift = {
      id: Date.now().toString(),
      name: newShift.name!,
      startTime: newShift.startTime!,
      endTime: newShift.endTime!,
      employee: newShift.employee!,
      status: 'scheduled',
      date: selectedDate,
      totalSales: 0,
      transactionCount: 0,
      openingCash: newShift.openingCash || 500,
      notes: newShift.notes
    };

    setShifts([...shifts, shift]);
    setNewShift({
      name: '',
      startTime: '',
      endTime: '',
      employee: '',
      openingCash: 500,
      notes: ''
    });
    setIsAddingShift(false);
    
    toast({
      title: "تم إضافة الشيفت",
      description: "تم جدولة الشيفت الجديد بنجاح"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">نشط</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">مكتمل</Badge>;
      case 'scheduled':
        return <Badge variant="outline">مجدول</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const totalDaySales = filteredShifts.reduce((sum, shift) => sum + shift.totalSales, 0);
  const totalTransactions = filteredShifts.reduce((sum, shift) => sum + shift.transactionCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                <p className="text-lg font-semibold">{totalDaySales.toFixed(2)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عدد المعاملات</p>
                <p className="text-lg font-semibold">{totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">الشيفتات النشطة</p>
                <p className="text-lg font-semibold">
                  {filteredShifts.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">شيفتات اليوم</p>
                <p className="text-lg font-semibold">{filteredShifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              إدارة الشيفتات
            </span>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button 
                onClick={() => setIsAddingShift(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة شيفت
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Shift Form */}
          {isAddingShift && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="اسم الشيفت"
                    value={newShift.name}
                    onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                  />
                  <Input
                    type="time"
                    placeholder="وقت البداية"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                  />
                  <Input
                    type="time"
                    placeholder="وقت النهاية"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                  />
                  <Input
                    placeholder="اسم الموظف"
                    value={newShift.employee}
                    onChange={(e) => setNewShift({...newShift, employee: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="رأس المال الافتتاحي"
                    value={newShift.openingCash}
                    onChange={(e) => setNewShift({...newShift, openingCash: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="ملاحظات"
                    value={newShift.notes}
                    onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addNewShift} className="bg-green-600 hover:bg-green-700">
                    حفظ الشيفت
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingShift(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shifts List */}
          <div className="space-y-4">
            {filteredShifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{shift.name}</h3>
                        <p className="text-sm text-gray-600">
                          {shift.employee} • {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                      {getStatusBadge(shift.status)}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">المبيعات</p>
                        <p className="font-semibold">{shift.totalSales.toFixed(2)} ج.م</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">المعاملات</p>
                        <p className="font-semibold">{shift.transactionCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">رأس المال</p>
                        <p className="font-semibold">{shift.openingCash} ج.م</p>
                      </div>

                      <div className="flex gap-2">
                        {shift.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => startShift(shift.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            بدء
                          </Button>
                        )}
                        {shift.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const closingCash = prompt('أدخل رأس المال الختامي:');
                              if (closingCash) {
                                endShift(shift.id, Number(closingCash));
                              }
                            }}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            إنهاء
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {shift.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>ملاحظات:</strong> {shift.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredShifts.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد شيفتات في هذا التاريخ</p>
              <Button 
                onClick={() => setIsAddingShift(true)}
                className="mt-4"
                variant="outline"
              >
                إضافة شيفت جديد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftManagement;
