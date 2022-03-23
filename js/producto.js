class Maquillaje {
    constructor (id, nombre, tono, precio, img, seccion, cantidad){
        this.id= parseInt(id);
        this.nombre = nombre.toUpperCase();
        this.tono = tono.toUpperCase();
        this.precio = parseFloat(precio);
        this.img = img;
        this.seccion= seccion.toString().toUpperCase();
        this.cantidad = cantidad || 1;
    }
    sumaIva(){
        this.precio = this.precio * 1.2.toFixed(2);
    }
    subTotal(){
        return this.precio * this.cantidad;
    }
    fechaCompra(){
        let fecha= DateTime.now();
        this.fecha= fecha.toLocaleString(DateTime.DATE_SHORT);
    }
    agregarCantidad(valor){
        this.cantidad+= valor;
    }
}