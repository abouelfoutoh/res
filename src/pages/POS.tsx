: 0 auto; padding: 20px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>مطعم ابوالفتوح للمأكولات الشامية</h2>
          <p>القاهرة، مصر</p>
          <p style="font-weight: bold; font-size: 18px;">فاتورة رقم: ${invoiceData.invoiceNumber}</p>
          <p>التاريخ: ${invoiceData.date}</p>
          <p>الوقت: ${invoiceData.time}</p>
          ${invoiceData.customerName !== 'عميل' ? `<p>العميل: ${invoiceData.customerName}</p>` : ''}
          <p><strong>نوع الطلب:</strong> ${getOrderTypeText(invoiceData.orderType)}</p>
          ${invoiceData.tableNumber ? `<p><strong>رقم الطاولة:</strong> ${invoiceData.tableNumber}</p>` : ''}
          ${invoiceData.driverName ? `<p><strong>الطيار:</strong> ${invoiceData.driverName}</p>` : ''}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: right; padding: 8px;">الصنف</th>
              <th style="text-align: center; padding: 8px;">الكمية</th>
              <th style="text-align: center; padding: 8px;">السعر</th>
              <th style="text-align: center; padding: 8px;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="text-align: right; padding: 8px;">${item.name}</td>
                <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                <td style="text-align: center; padding: 8px;">${item.price} ج.م</td>
                <td style="text-align: center; padding: 8px;">${(item.price * item.quantity).toFixed(2)} ج.م</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="border-top: 2px solid #000; padding-top: 10px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>المجموع الفرعي:</span>
            <span>${invoiceData.subtotal.toFixed(2)} ج.م</span>
          </div>
          ${invoiceData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: green;">
              <span>الخصم (${invoiceData.discount}%):</span>
              <span>-${invoiceData.discountAmount.toFixed(2)} ج.م</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>الضريبة (${invoiceData.taxRate}%):</span>
            <span>${invoiceData.taxAmount.toFixed(2)} ج.م</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #000; padding-top: 5px;">
            <span>الإجمالي النهائي:</span>
            <span>${invoiceData.total.toFixed(2)} ج.م</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>شكراً لزيارتكم</p>
          <p>نتطلع لخدمتكم مرة أخرى</p>
          <p style="margin-top: 10px;">تم الدفع: ${invoice?.paymentMethod === 'cash' ? 'نقداً' : 'بالبطاقة'}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>فاتورة رقم ${invoiceData.invoiceNumber}</title>
            <meta charset="utf-8">
          </head>
          <body>
            ${invoiceContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card') => {
    // Validate order type requirements
    if (orderType === 'dine-in' && !selectedTable) {
      setShowTableDialog(true);
      return;
    }
    
    if (orderType === 'delivery' && !selectedDriver) {
      setShowDriverDialog(true);
      return;
    }
    
    console.log('Processing checkout:', {
      cart,
      customerName,
      orderType,
      selectedTable,
      selectedDriver,
      subtotal,
      discount,
      taxAmount,
      total,
      paymentMethod
    });
    
    // Create invoice
    const invoice = createInvoice(paymentMethod);
    
    // Reduce inventory
    reduceInventory();
    
    // Print invoice
    printInvoice(invoice);
    
    clearCart();
    toast({
      title: "تم إتمام البيع بنجاح!",
      description: `فاتورة رقم: ${invoice.invoiceNumber} - تم خصم الكميات من المخزون وطباعة الفاتورة`,
    });
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'dine-in': return <Home className="h-4 w-4" />;
      case 'takeaway': return <ShoppingCart className="h-4 w-4" />;
      case 'delivery': return <Truck className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              نقطة البيع (POS)
              <Badge variant="outline" className="mr-auto">
                آخر فاتورة: {lastInvoiceNumber.toString().padStart(6, '0')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Categories */}
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

            {/* Category Buttons */}
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

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-orange-600">{product.price} ج.م</p>
                    <p className="text-xs text-gray-500">متوفر: {product.stock}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                السلة ({cart.length})
              </span>
              {cart.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Name */}
            <Input
              placeholder="اسم العميل (اختياري)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            {/* Order Type Selection */}
            <div className="space-y-2">
              <Label>نوع الطلب</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={orderType === 'dine-in' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('dine-in')}
                  className={orderType === 'dine-in' ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Home className="h-4 w-4 mr-1" />
                  داخل المطعم
                </Button>
                <Button
                  variant={orderType === 'takeaway' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('takeaway')}
                  className={orderType === 'takeaway' ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  تيك أواي
                </Button>
                <Button
                  variant={orderType === 'delivery' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrderType('delivery')}
                  className={orderType === 'delivery' ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  دليفري
                </Button>
              </div>
            </div>

            {/* Table/Driver Selection */}
            {orderType === 'dine-in' && (
              <div className="space-y-2">
                <Label>اختيار الطاولة</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طاولة متاحة" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        طاولة {table.number} - {table.capacity} أشخاص
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTable && (
                  <p className="text-sm text-green-600">
                    ✓ تم اختيار طاولة {tables.find(t => t.id === selectedTable)?.number}
                  </p>
                )}
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="space-y-2">
                <Label>اختيار الطيار</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طيار متاح" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.vehicleType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDriver && (
                  <p className="text-sm text-green-600">
                    ✓ تم اختيار الطيار {drivers.find(d => d.id === selectedDriver)?.name}
                  </p>
                )}
              </div>
            )}
            
            {/* Cart Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">السلة فارغة</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price} ج.م</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <Separator />
                
                {/* Discount */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">خصم %:</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20"
                  />
                </div>

                {/* Bill Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم ({discount}%):</span>
                      <span>-{discountAmount.toFixed(2)} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>الضريبة ({taxRate}%):</span>
                    <span>{taxAmount.toFixed(2)} ج.م</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي:</span>
                    <span className="text-orange-600">{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={() => handleCheckout('cash')}
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    دفع نقدي
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCheckout('card')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    دفع بالبطاقة
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => printInvoice()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    طباعة الفاتورة
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Selection Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>اختيار الطاولة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">يرجى اختيار طاولة متاحة لإتمام الطلب</p>
            <div className="grid grid-cols-2 gap-2">
              {availableTables.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable === table.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTable(table.id);
                    setShowTableDialog(false);
                  }}
                  className="h-16 flex flex-col"
                >
                  <Users className="h-4 w-4 mb-1" />
                  <span>طاولة {table.number}</span>
                  <span className="text-xs">{table.capacity} أشخاص</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Driver Selection Dialog */}
      <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>اختيار الطيار</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">يرجى اختيار طيار متاح لتوصيل الطلب</p>
            <div className="space-y-2">
              {availableDrivers.map((driver) => (
                <Button
                  key={driver.id}
                  variant={selectedDriver === driver.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedDriver(driver.id);
                    setShowDriverDialog(false);
                  }}
                  className="w-full justify-start"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  <span>{driver.name} - {driver.vehicleType}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;