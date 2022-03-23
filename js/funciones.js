function maquillajesHTML(lista){
    maquillajesProductos.innerHTML= "";
    for (const maquillaje of lista){
        let divMaquillaje= document.createElement('div');    
        divMaquillaje.classList.add("col"); 
            divMaquillaje.innerHTML=    `<div class="card" style="width: 18rem;">
                                            <img src="${maquillaje.img}" class="card-img-top" alt="...">
                                            <div class="card-body">
                                                <h5 class="card-title">${maquillaje.nombre}</h5>
                                                <p class="card-text">$ ${maquillaje.precio}</p>
                                                <button id='${maquillaje.id}' class = "boton">ADD TO CART</button>
                                            </div>
                                        </div>`;
            maquillajesProductos.append(divMaquillaje);
    }
    seleccionarMaquillaje();
}

function seleccionarMaquillaje(){
    let botonProducto = document.getElementsByClassName("boton");
    for (const boton of botonProducto) {
        boton.addEventListener('click',function () {
                let seleccion= carrito.find(maquillaje => maquillaje.id == this.id);
                if(seleccion){
                    seleccion.addCantidad();
                }else{
                    seleccion = maquillajes.find(maquillaje => maquillaje.id == this.id);
                    carrito.push(seleccion);
                }
                localStorage.setItem('Carrito', JSON.stringify(carrito));
                carritoHTML(carrito);    
                Toastify({
                    text: `Product has been added: ${seleccion.nombre}`,                                
                    duration: 3000,
                    style: {
                            background: "#ff99cb",
                          },
                    gravity: "bottom"                                
                })
                .showToast();        
        });        
    }
}

function carritoHTML(lista) {
    cantidadCarrito.innerHTML= lista.length;
    maquillajesCarrito.innerHTML=`<h3 class= 'title-carrito'>PRODUCTS</h3>
                                    <hr>`;
    for (const maquillaje of lista) {
            let prod= document.createElement('div');
            prod.innerHTML= `
            <div class="div-carrito">
            ${maquillaje.nombre} 
            <span class="badge">Price: $ ${maquillaje.precio}</span>
            <span class="badge">Quantity: ${maquillaje.cantidad}</span>
            <span class="badge">Subtotal: $${maquillaje.subTotal()}</span>
            <a id="${maquillaje.id}" class="btn-add">+</a>
            <a id="${maquillaje.id}" class="btn-sub">-</a>
            <a id="${maquillaje.id}" class="btn-delete">x</a>
            </div>`;
            maquillajesCarrito.append(prod);
    }
    document.querySelectorAll(".btn-delete").forEach(boton => boton.onclick= eliminarCarrito);
    document.querySelectorAll(".btn-add").forEach(boton => boton.onclick= addCarrito);
    document.querySelectorAll(".btn-sub").forEach(boton => boton.onclick= subCarrito);
    totalCarrito();
}

function eliminarCarrito(e){
    let posicion= carrito.findIndex(maquillaje => maquillaje.id == e.target.id);
    carrito.splice(posicion,1);
    carritoHTML(carrito);
    localStorage.setItem("Carrito", JSON.stringify(carrito));
}

function addCarrito(){
    let maquillaje = carrito.find(m => m.id == this.id);
    maquillaje.agregarCantidad(1);
    this.parentNode.children[1].innerHTML="Quantity: "+ maquillaje.cantidad;
    this.parentNode.children[2].innerHTML="Subtotal: "+ maquillaje.subTotal();
    totalCarrito();
    localStorage.setItem("Carrito", JSON.stringify(carrito));
}

function subCarrito(e){
    let maquillaje = carrito.find(m => m.id == this.id);
    if(maquillaje.cantidad > 1){
        maquillaje.agregarCantidad(-1);
        this.parentNode.children[1].innerHTML="Quantity: "+ maquillaje.cantidad;
        this.parentNode.children[2].innerHTML="Subtotal: "+ maquillaje.subTotal();
        totalCarrito();
        localStorage.setItem("Carrito", JSON.stringify(carrito));
    }
}

function filtroUI(maquillajes){
    filtroRender.innerHTML="";
    filtroRender.append("CATEGORY: ");

    const porCategorias= maquillajes.map(maquillaje => maquillaje.seccion);
    crearSelect(arraySinDuplicados(porCategorias), "seccion");
}

function crearSelect(lista, clave){
    let newSelect = document.createElement("select");
    newSelect.innerHTML= "<option>"+lista.join("</option><option>")+"</option>";
    filtroRender.append(newSelect);

    newSelect.addEventListener('change', function (){
        const filtrarCategorias = maquillajes.filter(maquillaje => maquillaje[clave] == this.value)
        maquillajesHTML(filtrarCategorias);
    })
}
function arraySinDuplicados(lista){
    let unicos= [];
    lista.forEach(maquillaje => {
        if(!unicos.includes(maquillaje)){
            unicos.push(maquillaje);
        }
    });
    return unicos;
}

filtroNombre.addEventListener('input', function(){
    const filtrados= maquillajes.filter(maquillaje=> maquillaje.nombre.includes(this.value.toUpperCase()))
    maquillajesHTML(filtrados);
})

limpiar.onclick= () => {
    filtroNombre.value = "";
    maquillajesHTML(maquillajes);
}

function totalCarrito() {
    let total = carrito.reduce((totalCompra, actual) => totalCompra += actual.subTotal(), 0);
    totalCarritoInterfaz.innerHTML= "Total: $"+total;
    return total;
}

function vaciarCarrito() {
    localStorage.clear();
    carrito.splice(0, carrito.length);
    carritoHTML(carrito);
    totalCarritoInterfaz.innerHTML= "Total: $"+0;
}

function promesaCompra(saldo) {
    return new Promise(function (aceptado, rechazado) {
            if (saldo > 0) {
                    aceptado('Compra aceptada');

            } else {
                    rechazado('Compra rechazada');
            }
    })
}

function alertaEstado(mensaje, tipo) {
    Swal.fire(
            'Estado de compra',
            mensaje,
            tipo
    )

}

function signUp(){
    let email = document.getElementById("footerNewsletterEmail").value;
    if(email){ 
        Swal.fire({
            icon: 'success',
            title: 'You have logged into your account!',
          })
        localStorage.setItem("signUp", JSON.stringify(email));
    }
}


function validar(input, mensaje){
    let elemento= document.querySelector(`.${input}`);
    elemento.lastElementChild.innerHTML= mensaje;
  }
  
  function validarPorInputs(){
    let condicion = true;
    listInputs.forEach(element =>{
      element.lastElementChild.innerHTML="";
    })
    if(nombre.value.length <1 || nombre.value.trim()== ""){
      validar("registerFirstName", "The name is invalid");
      condicion = false;
    }
    if(apellido.value.length <1 || apellido.value.trim()== ""){
      validar("registerLastName", "The last name is invalid");
      condicion = false;
    }
    if(email.value.length <1 || email.value.trim()== ""){
      validar("registerEmail", "The email is invalid");
      condicion = false;
    }
    if(contraseña.value.length <1 || contraseña.value.trim()== ""){
      validar("registerPassword", "The password is invalid");
      condicion = false;
    }
    return condicion;
  }
  
  function enviarFormulario(){
    sessionStorage.setItem('validarPorInputs', JSON.stringify(form));
    form.reset();
    Swal.fire({
      icon: 'success',
      title: 'You have created your account!',
    })
  }