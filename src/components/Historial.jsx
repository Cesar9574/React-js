import { useState } from 'react'

function Historial({ ventas }) {
  const [seleccionada, setSeleccionada] = useState(null)

  return (
    <div>
      <h2>Historial de ventas</h2>
      <table>
        <thead>
          <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.fecha}</td>
              <td>{v.cliente}</td>
              <td>Q{v.total.toFixed(2)}</td>
              <td><button className="btn suave" onClick={() => setSeleccionada(v)}>Ver detalle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {ventas.length === 0 && <p>Todavía no hay ventas registradas.</p>}

      {seleccionada && (
        <div>
          <h3>Detalle de venta #{seleccionada.id}</h3>
          <table>
            <thead>
              <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {seleccionada.items.map((i) => (
                <tr key={i.productoId}>
                  <td>{i.nombre}</td>
                  <td>{i.cantidad}</td>
                  <td>Q{i.precio.toFixed(2)}</td>
                  <td>Q{(i.precio * i.cantidad).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Historial
