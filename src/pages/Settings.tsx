import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings as SettingsIcon, 
  Save,
  Bell,
  Printer,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Database,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'مطعم ابوالفتوح للمأكولات الشامية',
    address: 'شارع التحرير، وسط البلد، القاهرة، مصر',
    phone: '+20-2-1234567',
    email: 'info@abouelfoutoh.com',
    website: 'www.abouelfoutoh.com',
    description: 'مطعم متخصص في المأكولات السورية الأصيلة منذ عام 1995',
    taxNumber: '123-456-789',
    commercialRegister: 'CR-123456789',
  });

  const [taxSettings, setTaxSettings] = useState({
    defaultTaxRate: 14,
    enableTax: true,
    taxInclusive: false,
    vatNumber: 'VAT-123456789',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptOnline: true,
    defaultPaymentMethod: 'cash',
    enableTips: true,
    maxCashAmount: 10000,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockAlerts: true,
    dailyReports: true,
    emailNotifications: true,
    smsNotifications: false,
    soundAlerts: true,
  });

  const [printerSettings, setPrinterSettings] = useState({
    enablePrinting: true,
    printerName: 'طابعة المطبخ الرئيسية',
    paperSize: 'A4',
    autoprint: false,
    receiptsInArabic: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'ar',
    timezone: 'Africa/Cairo',
    currency: 'EGP',
    dateFormat: 'dd/mm/yyyy',
    backupEnabled: true,
    autoBackupDays: 7,
  });

  const handleSave = (section: string) => {
    toast({
      title: "تم الحفظ بنجاح",
      description: `تم حفظ إعدادات ${section} بنجاح`,
    });
  };

  const handleBackup = () => {
    toast({
      title: "تم بدء النسخ الاحتياطي",
      description: "سيتم إنشاء نسخة احتياطية من البيانات",
    });
  };

  const handleRestoreDefaults = () => {
    toast({
      title: "تم استعادة الإعدادات الافتراضية",
      description: "تم إعادة تعيين جميع الإعدادات إلى القيم الافتراضية",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-orange-600" />
            الإعدادات العامة
          </h1>
          <p className="text-gray-600 mt-2">إدارة إعدادات المطعم والنظام</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackup}>
            <Database className="h-4 w-4 mr-2" />
            نسخ احتياطي
          </Button>
          <Button variant="outline" onClick={handleRestoreDefaults}>
            استعادة الافتراضي
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              معلومات المطعم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">اسم المطعم</Label>
              <Input
                id="restaurant-name"
                value={restaurantSettings.name}
                onChange={(e) => setRestaurantSettings({...restaurantSettings, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-address">العنوان</Label>
              <Textarea
                id="restaurant-address"
                value={restaurantSettings.address}
                onChange={(e) => setRestaurantSettings({...restaurantSettings, address: e.target.value})}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="restaurant-phone">رقم الهاتف</Label>
                <Input
                  id="restaurant-phone"
                  value={restaurantSettings.phone}
                  onChange={(e) => setRestaurantSettings({...restaurantSettings, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-email">البريد الإلكتروني</Label>
                <Input
                  id="restaurant-email"
                  type="email"
                  value={restaurantSettings.email}
                  onChange={(e) => setRestaurantSettings({...restaurantSettings, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-website">الموقع الإلكتروني</Label>
              <Input
                id="restaurant-website"
                value={restaurantSettings.website}
                onChange={(e) => setRestaurantSettings({...restaurantSettings, website: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-description">وصف المطعم</Label>
              <Textarea
                id="restaurant-description"
                value={restaurantSettings.description}
                onChange={(e) => setRestaurantSettings({...restaurantSettings, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-number">الرقم الضريبي</Label>
                <Input
                  id="tax-number"
                  value={restaurantSettings.taxNumber}
                  onChange={(e) => setRestaurantSettings({...restaurantSettings, taxNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commercial-register">السجل التجاري</Label>
                <Input
                  id="commercial-register"
                  value={restaurantSettings.commercialRegister}
                  onChange={(e) => setRestaurantSettings({...restaurantSettings, commercialRegister: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={() => handleSave('معلومات المطعم')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ معلومات المطعم
            </Button>
          </CardContent>
        </Card>

        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إعدادات الضرائب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-tax">تفعيل الضرائب</Label>
              <Switch
                id="enable-tax"
                checked={taxSettings.enableTax}
                onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableTax: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-tax-rate">نسبة الضريبة الافتراضية (%)</Label>
              <Input
                id="default-tax-rate"
                type="number"
                min="0"
                max="100"
                value={taxSettings.defaultTaxRate}
                onChange={(e) => setTaxSettings({...taxSettings, defaultTaxRate: Number(e.target.value)})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tax-inclusive">الضريبة مُضمّنة في السعر</Label>
              <Switch
                id="tax-inclusive"
                checked={taxSettings.taxInclusive}
                onCheckedChange={(checked) => setTaxSettings({...taxSettings, taxInclusive: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat-number">رقم ضريبة القيمة المضافة</Label>
              <Input
                id="vat-number"
                value={taxSettings.vatNumber}
                onChange={(e) => setTaxSettings({...taxSettings, vatNumber: e.target.value})}
              />
            </div>

            <Button onClick={() => handleSave('إعدادات الضرائب')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ إعدادات الضرائب
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إعدادات الدفع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="accept-cash">قبول الدفع النقدي</Label>
                <Switch
                  id="accept-cash"
                  checked={paymentSettings.acceptCash}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCash: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="accept-card">قبول البطاقات</Label>
                <Switch
                  id="accept-card"
                  checked={paymentSettings.acceptCard}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCard: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="accept-online">الدفع الإلكتروني</Label>
                <Switch
                  id="accept-online"
                  checked={paymentSettings.acceptOnline}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptOnline: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enable-tips">تفعيل البقشيش</Label>
                <Switch
                  id="enable-tips"
                  checked={paymentSettings.enableTips}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableTips: checked})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-cash">الحد الأقصى للدفع النقدي (جنيه)</Label>
              <Input
                id="max-cash"
                type="number"
                min="0"
                value={paymentSettings.maxCashAmount}
                onChange={(e) => setPaymentSettings({...paymentSettings, maxCashAmount: Number(e.target.value)})}
              />
            </div>

            <Button onClick={() => handleSave('إعدادات الدفع')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ إعدادات الدفع
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="order-notifications">تنبيهات الطلبات الجديدة</Label>
                <Switch
                  id="order-notifications"
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="low-stock-alerts">تنبيهات نقص المخزون</Label>
                <Switch
                  id="low-stock-alerts"
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowStockAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="daily-reports">التقارير اليومية</Label>
                <Switch
                  id="daily-reports"
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyReports: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">تنبيهات البريد الإلكتروني</Label>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">تنبيهات الرسائل النصية</Label>
                <Switch
                  id="sms-notifications"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sound-alerts">التنبيهات الصوتية</Label>
                <Switch
                  id="sound-alerts"
                  checked={notificationSettings.soundAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, soundAlerts: checked})}
                />
              </div>
            </div>

            <Button onClick={() => handleSave('إعدادات التنبيهات')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ إعدادات التنبيهات
            </Button>
          </CardContent>
        </Card>

        {/* Printer Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              إعدادات الطباعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-printing">تفعيل الطباعة</Label>
              <Switch
                id="enable-printing"
                checked={printerSettings.enablePrinting}
                onCheckedChange={(checked) => setPrinterSettings({...printerSettings, enablePrinting: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="printer-name">اسم الطابعة</Label>
              <Input
                id="printer-name"
                value={printerSettings.printerName}
                onChange={(e) => setPrinterSettings({...printerSettings, printerName: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoprint">طباعة تلقائية للطلبات</Label>
              <Switch
                id="autoprint"
                checked={printerSettings.autoprint}
                onCheckedChange={(checked) => setPrinterSettings({...printerSettings, autoprint: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="receipts-arabic">طباعة الفواتير بالعربية</Label>
              <Switch
                id="receipts-arabic"
                checked={printerSettings.receiptsInArabic}
                onCheckedChange={(checked) => setPrinterSettings({...printerSettings, receiptsInArabic: checked})}
              />
            </div>

            <Button onClick={() => handleSave('إعدادات الطباعة')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ إعدادات الطباعة
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إعدادات النظام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                <select 
                  id="language"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={systemSettings.language}
                  onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">المنطقة الزمنية</Label>
                <select 
                  id="timezone"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={systemSettings.timezone}
                  onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                >
                  <option value="Africa/Cairo">القاهرة</option>
                  <option value="Asia/Riyadh">الرياض</option>
                  <option value="Asia/Dubai">دبي</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <select 
                  id="currency"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={systemSettings.currency}
                  onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                >
                  <option value="EGP">جنيه مصري</option>
                  <option value="SAR">ريال سعودي</option>
                  <option value="AED">درهم إماراتي</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">تنسيق التاريخ</Label>
                <select 
                  id="date-format"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={systemSettings.dateFormat}
                  onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
                >
                  <option value="dd/mm/yyyy">يوم/شهر/سنة</option>
                  <option value="mm/dd/yyyy">شهر/يوم/سنة</option>
                  <option value="yyyy-mm-dd">سنة-شهر-يوم</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="backup-enabled">النسخ الاحتياطي التلقائي</Label>
              <Switch
                id="backup-enabled"
                checked={systemSettings.backupEnabled}
                onCheckedChange={(checked) => setSystemSettings({...systemSettings, backupEnabled: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backup-days">تكرار النسخ الاحتياطي (أيام)</Label>
              <Input
                id="backup-days"
                type="number"
                min="1"
                max="30"
                value={systemSettings.autoBackupDays}
                onChange={(e) => setSystemSettings({...systemSettings, autoBackupDays: Number(e.target.value)})}
              />
            </div>

            <Button onClick={() => handleSave('إعدادات النظام')} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              حفظ إعدادات النظام
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Global Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            إجراءات عامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => handleSave('جميع الإعدادات')} className="bg-gradient-to-r from-green-500 to-green-600">
              <Save className="h-4 w-4 mr-2" />
              حفظ جميع الإعدادات
            </Button>
            <Button variant="outline" onClick={handleBackup}>
              <Database className="h-4 w-4 mr-2" />
              إنشاء نسخة احتياطية
            </Button>
            <Button variant="outline" onClick={handleRestoreDefaults} className="text-red-600 hover:text-red-700">
              <Shield className="h-4 w-4 mr-2" />
              استعادة الإعدادات الافتراضية
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
