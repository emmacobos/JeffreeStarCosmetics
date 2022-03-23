fetch("../data/productos.json")
  .then(respuesta => respuesta.json())
  .then(data =>{
    for (const literal of data){
      maquillajes.push(new Maquillaje(literal.id, literal.nombre, literal.tono, literal.precio,literal.img, literal.seccion, literal.cantidad))
    }
    for (const maquillaje of maquillajes)
    maquillaje.sumaIva()
    maquillajesHTML(maquillajes, 'Productos');
    filtroUI(maquillajes);
  })

if("Maquillaje" in localStorage){
     const guardados= JSON.parse(localStorage.getItem('maquillajes'));
    console.log(guardados);
    for (const generico of guardados){
        maquillajes.push(new Maquillaje (generico.nombre, generico.tono, generico.precio));
    }
    console.log(maquillajes);
    maquillajesHTML(maquillajes);
 }

confirmar.onclick = () => {
    let total = totalCarrito();
    saldoCliente -= total;
   
    promesaCompra(saldoCliente).then((mensaje) => {
      maquillajesCarrito.innerHTML = ` <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`
      fetch('prov/provincias.json')
        .then((respuesta) => {
          return respuesta.json()
        }).then((datos) => {
          maquillajesCarrito.innerHTML = `  <h3>Shipping Info</h3>
                                                <select id="provFiltro"></select> 
                                                <select id="munFiltro"></select>`;
          const provFiltro = document.getElementById('provFiltro');
          for (const provincia of datos.provincias) {
            provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`;
          }
          provFiltro.onchange = () => {
            let idProvincia = provFiltro.value;
            let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`;
            fetch(rutaBusqueda)
              .then(respuesta => respuesta.json())
              .then(datos => {
                let munFiltro = document.getElementById('munFiltro');
                for (const municipio of datos.municipios) {
                  munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`;
                }
                document.getElementById('confirmar').onclick = () => {
                  fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify({
                      carrito: carrito,
                      idProvincia: idProvincia,
                      idMunicipio: munFiltro.value
                    }),
                    headers: {
                      'Content-type': 'application/json; charset=UTF-8',
                    },
                  }).then(respuesta => respuesta.json())
                    .then(data => {
                      Swal.fire(
                        'success',
                        'Purchase confirmed!',
                        "YOUR ORDER N° "+ data.id+" WILL BE SENT "
                      )
                    })
                }
              })
          }
        })
        .catch((mensaje) => { console.log(mensaje) })     
    }).catch((mensaje) => {
      alertaEstado(mensaje, "error")
    }) 
  }

form.addEventListener("submit", (e)=> {
  e.preventDefault();
  let condicion = validarPorInputs();
  if(condicion){
    enviarFormulario();
  }
});

