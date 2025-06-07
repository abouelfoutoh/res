
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Save,
  X,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'cashier' | 'kitchen';
  salary: number;
  hireDate: Date;
  isActive: boolean;
  address?: string;
  nationalId?: string;
}

const Employees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    salary: 0,
    address: '',
    nationalId: '',
    isActive: true
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'أحمد محمد علي',
      email: 'ahmed@restaurant.com',
      phone: '01012345678',
      role: 'admin',
      salary: 8000,
      hireDate: new Date('2023-01-15'),
      isActive: true,
      address: 'شارع النيل، المعادي، القاهرة',
      nationalId: '12345678901234'
    },
    {
      id: '2',
      name: 'فاطمة حسن',
      email: 'fatima@restaurant.com',
      phone: '01098765432',
      role: 'cashier',
      salary: 4500,
      hireDate: new Date('2023-03-20'),
      isActive: true,
      address: 'شارع الهرم، الجيزة',
      nationalId: '23456789012345'
    },
    {
      id: '3',
      name: 'محمد أحمد',
      email: 'mohamed@restaurant.com',
      phone: '01087654321',
      role: 'kitchen',
      salary: 5000,
      hireDate: new Date('2023-02-10'),
      isActive: true,
      address: 'مدينة نصر، القاهرة',
      nationalId: '34567890123456'
    },
    {
      id: '4',
      name: 'سارة علي',
      email: 'sara@restaurant.com',
      phone: '01076543210',
      role: 'cashier',
      salary: 4200,
      hireDate: new Date('2023-06-01'),
      isActive: false,
      address: 'شبرا، القاهرة',
      nationalId: '45678901234567'
    }
  ]);

  const roles = [
    { id: 'all', name: 'جميع الأدوار' },
    { id: 'admin', name: 'مدير' },
    { id: 'cashier', name: 'كاشير' },
    { id: 'kitchen', name: 'مطبخ' }
  ];

  const getRoleName = (role: string) => {
    const roleObj = roles.find(r => r.id === role);
    return roleObj ? roleObj.name : role;
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      salary: 0,
      address: '',
      nationalId: '',
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      salary: employee.salary,
      address: employee.address || '',
      nationalId: employee.nationalId || '',
      isActive: employee.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    toast({
      title: "تم حذف الموظف",
      description: "تم حذف الموظف بنجاح",
    });
  };

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, isActive: !emp.isActive }
        : emp
    ));
    
    const employee = employees.find(emp => emp.id === employeeId);
    toast({
      title: employee?.isActive ? "تم إيقاف الموظف" : "تم تفعيل الموظف",
      description: employee?.isActive ? "تم إيقاف الموظف مؤقتاً" : "تم تفعيل الموظف",
    });
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email || !formData.phone || formData.salary! <= 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى التأكد من إدخال جميع البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (editingEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp,
              ...formData,
            } as Employee
          : emp
      ));
      toast({
        title: "تم تحديث الموظف",
        description: "تم تحديث بيانات الموظف بنجاح",
      });
    } else {
      // Add new employee
      const newEmployee: Employee = {
        ...formData,
        id: Date.now().toString(),
        hireDate: new Date()
      } as Employee;
      setEmployees([...employees, newEmployee]);
      toast({
        title: "تم إضافة الموظف",
        description: "تم إضافة موظف جديد بنجاح",
      });
    }

    setIsDialogOpen(false);
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive).length;
  const totalSalaries = employees.filter(emp => emp.isActive).reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-600" />
            إدارة الموظفين
          </h1>
          <p className="text-gray-600 mt-2">إدارة بيانات الموظفين والأدوار</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          onClick={handleAddEmployee}
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة موظف جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الموظفين النشطين</p>
                <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الموظفين المتوقفين</p>
                <p className="text-2xl font-bold text-red-600">{totalEmployees - activeEmployees}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المرتبات</p>
                <p className="text-2xl font-bold text-orange-600">{totalSalaries.toLocaleString()} ج.م</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
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
                placeholder="البحث عن موظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole === role.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(role.id)}
                className={selectedRole === role.id ? 
                  "bg-gradient-to-r from-orange-500 to-red-500" : ""
                }
              >
                {role.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{getRoleName(employee.role)}</p>
                  </div>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? 'نشط' : 'متوقف'}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>تاريخ التوظيف: {employee.hireDate.toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                {/* Salary */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المرتب الشهري:</span>
                    <span className="font-bold text-green-600">{employee.salary.toLocaleString()} ج.م</span>
                  </div>
                </div>

                {/* Address */}
                {employee.address && (
                  <div className="text-sm text-gray-600">
                    <strong>العنوان:</strong> {employee.address}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleToggleStatus(employee.id)}
                    className={employee.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                  >
                    {employee.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'تعديل الموظف' : 'إضافة موظف جديد'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="الاسم الكامل"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">الدور الوظيفي</Label>
                <select
                  id="role"
                  value={formData.role || 'cashier'}
                  onChange={(e) => setFormData({...formData, role: e.target.value as Employee['role']})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {roles.filter(role => role.id !== 'all').map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">المرتب الشهري (ج.م) *</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  value={formData.salary || 0}
                  onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">الرقم القومي</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId || ''}
                  onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                  placeholder="14 رقم"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="العنوان بالتفصيل"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEmployee} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {editingEmployee ? 'تحديث' : 'إضافة'}
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

export default Employees;
