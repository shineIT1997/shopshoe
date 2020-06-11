function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.SoLuong = oldCart.SoLuong || 0;
    this.Tien = oldCart.Tien || 0;

    this.add = function(item, id) {
        var giohang = this.items[id];
        if(!giohang) {
            giohang = this.items[id] = { item: item, sl: 0, tien: 0};
        }
        giohang.sl++;
        giohang.tien = giohang.item.price * giohang.sl;
        this.SoLuong++;
        this.Tien += giohang.item.price;
    }

    this.convertArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
    }
    return arr;
  }

  //xóa 1 sp
  this.delCart = function(id){
    this.items[id].sl--;
    this.items[id].tien -= this.items[id].item.price;
    this.SoLuong--;
    this.Tien -= this.items[id].item.price;

    if (this.items[id].sl <= 0) {
        delete this.items[id]
    }
}

//xóa nhiều sp
this.remove = function(id){
    this.SoLuong -= this.items[id].sl;
    this.Tien -= this.items[id].tien;
    delete this.items[id];
}
//update sp
this.updateCart = function(id, soluong){
    var sltruoc, slsau;
    var giohang = this.items[id];

    sltruoc = giohang.sl;
    slsau = parseInt(soluong);

    giohang.sl = slsau;
    giohang.tien = giohang.sl * giohang.item.price;
    this.SoLuong = slsau;
    this.Tien += (slsau - sltruoc)*giohang.item.price;
   
}

};

module.exports = Cart;
