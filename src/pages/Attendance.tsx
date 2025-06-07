import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  Search,
  Calculator,
  Download,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  overtime?: number;
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyRate: number;
  isActive: boolean;
}

const Attendance = () => {
  const { toast } = useToast();
  
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'أحمد محمد', position: 'كاشير', hourlyRate: 25, isActive: true },
    { id: '2', name: 'فاطمة أحمد', position: 'كاشير', hourlyRate: 25, isActive: true },
    { id: '3', name: 'محمد علي', position: 'طباخ', hourlyRate: 30, isActive: true },
    { id: '4', name: 'سارة حسن', position: 'مساعد طباخ', hourlyRate: 20, isActive: true },
  ]);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'أحمد محمد',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:00',
      checkOut: '16:30',
      workHours: 8.5,
      status: 'present',
      overtime: 0.5
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'فاطمة أحمد',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:15',
      status: 'late'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'محمد علي',
      date: new Date().toISOString().split('T')[0],
      checkIn: '07:45',
      checkOut: '15:45',
      workHours: 8,
      status: 'present'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const todayAttendance = attendance.filter(record => record.date === selectedDate);
  const filteredAttendance = todayAttendance.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployee = !selectedEmployee || record.employeeId === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  const checkIn = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const existingRecord = attendance.find(
      record => record.employeeId === employeeId && record.date === selectedDate
    );

    if (existingRecord) {
      toast({
        title: "خطأ",
        description: "الموظف سجل حضوره بالفعل اليوم",
        variant: "destructive"
      });
      return;
    }

    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0);
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId,
      employeeName: employee.name,
      date: selectedDate,
      checkIn: timeString,
      status: isLate ? 'late' : 'present'
    };

    setAttendance([...attendance, newRecord]);
    toast({
      title: "تم تسجيل الحضور",
      description: `تم تسجيل حضور ${employee.name} في ${timeString}`
    });
  };

  const checkOut = (recordId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    setAttendance(attendance.map(record => {
      if (record.id === recordId) {
        if (!record.checkIn) return record;
        
        const checkInTime = new Date(`1970-01-01T${record.checkIn}:00`);
        const checkOutTime = new Date(`1970-01-01T${timeString}:00`);
        const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        
        const regularHours = 8;
        const overtime = Math.max(0, workHours - regularHours);
        
        return {
          ...record,
          checkOut: timeString,
          workHours: parseFloat(workHours.toFixed(2)),
          overtime: parseFloat(overtime.toFixed(2)),
          status: workHours < 7 ? 'early_leave' : 'present'
        };
      }
      return record;
    }));

    const employee = employees.find(emp => 
      emp.id === attendance.find(r => r.id === recordId)?.employeeId
    );
    
    toast({
      title: "تم تسجيل الانصراف",
      description: `تم تسجيل انصراف ${employee?.name} في ${timeString}`
    });
  };

  const calculateSalary = (record: AttendanceRecord) => {
    const employee = employees.find(emp => emp.id === record.employeeId);
    if (!employee || !record.workHours) return 0;
    
    const regularPay = Math.min(record.workHours, 8) * employee.hourlyRate;
    const overtimePay = (record.overtime || 0) * employee.hourlyRate * 1.5;
    
    return regularPay + overtimePay;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">حاضر</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">غائب</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">متأخر</Badge>;
      case 'early_leave':
        return <Badge className="bg-orange-500">انصراف مبكر</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
  const lateCount = filteredAttendance.filter(r => r.status === 'late').length;
  const totalWorkHours = filteredAttendance.reduce((sum, r) => sum + (r.workHours || 0), 0);
  const totalSalaries = filteredAttendance.reduce((sum, r) => sum + calculateSalary(r), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">الحاضرين</p>
                <p className="text-lg font-semibold">{presentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">المتأخرين</p>
                <p className="text-lg font-semibold">{lateCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ساعات العمل</p>
                <p className="text-lg font-semibold">{totalWorkHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي الرواتب</p>
                <p className="text-lg font-semibold">{totalSalaries.toFixed(2)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            تسجيل سريع للحضور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {employees.filter(emp => emp.isActive).map((employee) => {
              const hasCheckedIn = todayAttendance.some(record => 
                record.employeeId === employee.id
              );
              
              return (
                <Button
                  key={employee.id}
                  variant={hasCheckedIn ? "outline" : "default"}
                  className={!hasCheckedIn ? "bg-gradient-to-r from-green-500 to-green-600" : ""}
                  onClick={() => !hasCheckedIn && checkIn(employee.id)}
                  disabled={hasCheckedIn}
                >
                  {employee.name}
                  {hasCheckedIn && " ✓"}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              سجل الحضور والانصراف
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تصدير
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث عن موظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">جميع الموظفين</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">الموظف</th>
                  <th className="text-center p-3">الحضور</th>
                  <th className="text-center p-3">الانصراف</th>
                  <th className="text-center p-3">ساعات العمل</th>
                  <th className="text-center p-3">إضافي</th>
                  <th className="text-center p-3">الراتب</th>
                  <th className="text-center p-3">الحالة</th>
                  <th className="text-center p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{record.employeeName}</p>
                        <p className="text-sm text-gray-600">
                          {employees.find(emp => emp.id === record.employeeId)?.position}
                        </p>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      {record.checkIn || '-'}
                    </td>
                    <td className="text-center p-3">
                      {record.checkOut || '-'}
                    </td>
                    <td className="text-center p-3">
                      {record.workHours ? `${record.workHours} ساعة` : '-'}
                    </td>
                    <td className="text-center p-3">
                      {record.overtime ? `${record.overtime} ساعة` : '-'}
                    </td>
                    <td className="text-center p-3">
                      {calculateSalary(record).toFixed(2)} ج.م
                    </td>
                    <td className="text-center p-3">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="text-center p-3">
                      {record.checkIn && !record.checkOut && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => checkOut(record.id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          انصراف
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد سجلات حضور لهذا التاريخ</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
