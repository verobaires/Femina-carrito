document.addEventListener("DOMContentLoaded", () => {
    cargarBaseDatos() //creo una funcion para cargar 
if (localStorage.getItem('compra')){
    compra = JSON.parse(localStorage.getItem('compra'))
    completarInfoCompra()
}



})

const cargarBaseDatos = async () => {
    try {
        const res = await fetch('baseDatos.json')
        const data = await res.json()
        console.log(data)
        completarProductos(data)
        detectarBotones(data)
    } catch (error) {
        console.log(error)
    }
}

const contendorProductos = document.querySelector('#contenedor-productos')
const completarProductos = (data) => {
    const template = document.querySelector('#productosElegidos').content
    const fragment = document.createDocumentFragment()
    // console.log(template)
    data.forEach(producto => {
        // console.log(producto)
        template.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        template.querySelector('h5').textContent = producto.title
        template.querySelector('p span').textContent = producto.precio
        template.querySelector('button').dataset.id = producto.id
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })
    contendorProductos.appendChild(fragment)
}

let compra = {}

const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            const producto = data.find(item => item.id === parseInt(btn.dataset.id))
            producto.cantidad = 1
            if (compra.hasOwnProperty(producto.id)) {
                producto.cantidad = compra[producto.id].cantidad + 1
            }
            compra[producto.id] = { ...producto }
            // console.log('compra', compra)
            completarInfoCompra()
        })
    })
}

const items = document.querySelector('#items')

const completarInfoCompra = () => {

    //pendiente innerHTML
    items.innerHTML = ''

    const template = document.querySelector('# listaCompra').content
    const fragment = document.createDocumentFragment()

    Object.values(compra).forEach(producto => {
        // console.log('producto', producto)
        template.querySelector('th').textContent = producto.id
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        template.querySelector('.btn-info').dataset.id = producto.id
        template.querySelector('.btn-danger').dataset.id = producto.id

        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    completarFooter()
    accionBotones()

    localStorage.setItem('compra', JSON.stringify(compra))

}

const footer = document.querySelector('#tabla-footer')
const completarFooter = () => {

    footer.innerHTML = ''

    if (Object.keys(compra).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5"> Vaciamos la lista</th>
        `
        return
    }

    const template = document.querySelector('#estructura-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(compra).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(compra).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)


    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        compra = {}
        completarInfoCompra()
    })

}

const accionBotones = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-info')
    const botonesEliminar = document.querySelectorAll('#items .btn-danger')

    // console.log(botonesAgregar)

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log(btn.dataset.id)
            Swal.fire({
                position: 'top-middle',
                icon: 'success',
                title: 'Gracias por comprar',
                showConfirmButton: false,
                timer: 1500
              })


            const producto = compra[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            completarInfoCompra()
        })
    })

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', () => {
            // console.log('eliminando...')

            Swal.fire({
                title: 'Estas seguro?',
                text: "Podrias perder tu info",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si eliminar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    'Borrado!',
                    'Este item fue eliminado.',
                    'success'
                  )
                }
              })


            
            const producto = compra[btn.dataset.id]
            producto.cantidad--
            if (producto.cantidad === 0) {
                delete compra[btn.dataset.id]
            } else {
                compra[btn.dataset.id] = { ...producto }
            }
            completarInfoCompra()
        })
    })
}

/* SWEETALERT
botonesAgregar.addEventListener('click', () => {
    Swal.fire({
        position: 'top-middle',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
})

botonesEliminar.addEventListener('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
}) */

// let carritoEjemplo = {}
// carritoEjemplo = {
//     1: {id: 1, titulo: 'cafe', precio: 500, cantidad: 3},
//     2: {id: 3, titulo: 'pizza', precio: 100, cantidad: 2},
// }

// console.log(carritoEjemplo[1])

//LOCAL STORAGE
