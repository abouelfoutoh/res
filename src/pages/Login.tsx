import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في نظام إدارة المطعم",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الاتصال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-16 h-16 flex items-center justify-center">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">مطعم ابو الفتوح للمأكولات السورية</CardTitle>
          <CardDescription className="text-lg">نظام أبوالفتوح لادارة المطاعم V.0.0.1</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* أزرار تعبئة تلقائية */}
          <div className="space-y-2">
            <h3 className="font-semibold text-center">تعبئة تلقائية:</h3>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail('admin@restaurant.com');
                  setPassword('password');
                }}
              >
                مدير
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail('cashier@restaurant.com');
                  setPassword('password');
                }}
              >
                كاشير
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEmail('kitchen@restaurant.com');
                  setPassword('password');
                }}
              >
                مطبخ
              </Button>
            </div>
          </div>

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          {/* معلومات الحسابات التجريبية */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">حسابات تجريبية:</h3>
            <div className="text-sm space-y-1">
              <p><strong>مدير:</strong> admin@restaurant.com</p>
              <p><strong>كاشير:</strong> cashier@restaurant.com</p>
              <p><strong>مطبخ:</strong> kitchen@restaurant.com</p>
              <p className="text-orange-600 font-medium mt-2">كلمة المرور: password</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
