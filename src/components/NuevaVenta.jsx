import { useState } from 'react'

function NuevaVenta({ productos, setProductos, clientes, ventas, setVentas, avisar }) {
  const [clienteId, setClienteId] = useState(clientes[0]?.id ?? '')
  const [productoId, setProductoId] = useState(productos[0]?.id ?? '')
  const [cantidad, setCantidad] = useState(1)
  const [carrito, setCarrito] = useState([])

  // El total se calcula cada vez que cambia el carrito
  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  const agregarAlCarrito = () => {
    const prod = productos.find((p) => p.id === Number(productoId))
    const cant = parseInt(cantidad)
    if (!prod || !cant || cant <= 0) {
      avisar('Elige un producto y una cantidad mayor a 0', true)
      return
    }
    // Si el producto ya está en el carrito sumamos la cantidad
    const yaEsta = carrito.find((i) => i.productoId === prod.id)
    const cantidadTotal = (yaEsta ? yaEsta.cantidad : 0) + cant
    if (cantidadTotal > prod.stock) {
      avisar(`Stock insuficiente de "${prod.nombre}" (disponible: ${prod.stock})`, true)
      return
    }
    if (yaEsta) {
      setCarrito(carrito.map((i) => (i.productoId === prod.id ? { ...i, cantidad: cantidadTotal } : i)))
    } else {
      setCarrito([...carrito, { productoId: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: cant }])
    }
    avisar('')
  }

  const quitar = (id) => setCarrito(carrito.filter((i) => i.productoId !== id))

  const confirmar = () => {
    if (carrito.length === 0) {
      avisar('La venta debe tener al menos un producto', true)
      return
    }
    const cliente = clientes.find((c) => c.id === Number(clienteId))
    const nuevoId = ventas.length ? Math.max(...ventas.map((v) => v.id)) + 1 : 1

    // 1) Guardamos la venta
    const venta = {
      id: nuevoId,
      fecha: new Date().toLocaleString('es-GT'),
      cliente: cliente ? cliente.nombre : 'Sin cliente',
      items: carrito,
      total,
    }
    setVentas([venta, ...ventas])

    // 2) Descontamos el stock de cada producto vendido
    setProductos(
      productos.map((p) => {
        const vendido = carrito.find((i) => i.productoId === p.id)
        return vendido ? { ...p, stock: p.stock - vendido.cantidad } : p
      })
    )

    avisar(`Venta #${nuevoId} registrada. Total: Q${total.toFixed(2)}`)
    setCarrito([])
  }

  return (
    <div>
      <h2>Nueva venta</h2>
      <div className="panel formulario">
        <label>Cliente:</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>
      <div className="panel formulario">
        <label>Producto:</label>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} (Q{p.precio}) - stock {p.stock}
            </option>
          ))}
        </select>
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          style={{ width: 70 }}
        />
        <button className="btn" onClick={agregarAlCarrito}>Agregar al carrito</button>
      </div>

      <table>
        <thead>
          <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          {carrito.map((i) => (
            <tr key={i.productoId}>
              <td>{i.nombre}</td>
              <td>{i.cantidad}</td>
              <td>Q{i.precio.toFixed(2)}</td>
              <td>Q{(i.precio * i.cantidad).toFixed(2)}</td>
              <td><button className="btn peligro" onClick={() => quitar(i.productoId)}>Quitar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="total">Total a cobrar: <strong>Q{total.toFixed(2)}</strong></p>
      <button className="btn" onClick={confirmar}>Confirmar venta</button>
    </div>
  )
}

export default NuevaVenta
