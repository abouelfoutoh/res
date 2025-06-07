import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';

interface Waiter {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
}

const Waiters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [waiters, setWaiters] = useState<Waiter[]>([
    { id: '1', name: 'محمد أحمد', phone: '01012345678', status: 'active' },
    { id: '2', name: 'سعيد علي', phone: '01123456789', status: 'inactive' },
  ]);

  const filteredWaiters = waiters.filter((w) =>
    w.name.includes(searchTerm) || w.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <User className="text-blue-500" />
          إدارة الويترية
        </h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          ويتر جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بحث عن ويتر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث بالاسم أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الويترية ({filteredWaiters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-right border-separate border-spacing-y-2">
            <thead className="text-gray-600 text-sm">
              <tr>
                <th className="text-right">الاسم</th>
                <th className="text-right">الهاتف</th>
                <th className="text-right">الحالة</th>
                <th className="text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredWaiters.map((w) => (
                <tr key={w.id} className="bg-white shadow-sm rounded">
                  <td className="p-3 font-medium">{w.name}</td>
                  <td className="p-3">{w.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        w.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {w.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Waiters;
