import { useState } from 'react'

const formVacio = { nombre: '', categoria: '', precio: '', stock: '' }

function Productos({ productos, setProductos, ventas, avisar }) {
  const [form, setForm] = useState(formVacio)
  const [editandoId, setEditandoId] = useState(null) // si es null, estamos agregando

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const guardar = () => {
    if (!form.nombre.trim() || !form.categoria.trim() || form.precio === '' || form.stock === '') {
      avisar('Faltan datos del producto', true)
      return
    }
    const precio = parseFloat(form.precio)
    const stock = parseInt(form.stock)
    if (precio < 0 || stock < 0) {
      avisar('El precio y el stock no pueden ser negativos', true)
      return
    }

    if (editandoId === null) {
      // Agregar: el nuevo id es el mayor que hay + 1
      const nuevoId = productos.length ? Math.max(...productos.map((p) => p.id)) + 1 : 1
      setProductos([...productos, { id: nuevoId, nombre: form.nombre, categoria: form.categoria, precio, stock }])
      avisar('Producto agregado')
    } else {
      // Editar: reemplazamos solo el producto que se está editando
      setProductos(
        productos.map((p) =>
          p.id === editandoId ? { ...p, nombre: form.nombre, categoria: form.categoria, precio, stock } : p
        )
      )
      avisar('Producto actualizado')
      setEditandoId(null)
    }
    setForm(formVacio)
  }

  const editar = (p) => {
    setEditandoId(p.id)
    setForm({ nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock })
  }

  const cancelar = () => {
    setEditandoId(null)
    setForm(formVacio)
  }

  const eliminar = (id) => {
    // No dejamos eliminar si el producto ya se vendió (para no dañar el historial)
    const tieneVentas = ventas.some((v) => v.items.some((i) => i.productoId === id))
    if (tieneVentas) {
      avisar('No se puede eliminar: el producto ya tiene ventas', true)
      return
    }
    setProductos(productos.filter((p) => p.id !== id))
    avisar('Producto eliminado')
  }

  return (
    <div>
      <h2>Productos</h2>
      <div className="panel formulario">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={manejarCambio} />
        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={manejarCambio} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={manejarCambio} />
        <button className="btn" onClick={guardar}>
          {editandoId === null ? 'Agregar' : 'Guardar cambios'}
        </button>
        {editandoId !== null && (
          <button className="btn suave" onClick={cancelar}>Cancelar</button>
        )}
      </div>

      <div className="estante">
        {productos.map((p) => (
          <article key={p.id} className={p.stock < 5 ? 'etiqueta poco' : 'etiqueta'}>
            <span className="agujero"></span>
            <p className="codigo">Código {p.id} · {p.categoria}</p>
            <h3>{p.nombre}</h3>
            <p className="precio">Q{p.precio.toFixed(2)}</p>
            <p className="existencia">
              {p.stock < 5 ? `Quedan solo ${p.stock}` : `${p.stock} en bodega`}
            </p>
            <div className="acciones">
              <button className="btn suave" onClick={() => editar(p)}>Editar</button>
              <button className="btn peligro" onClick={() => eliminar(p.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Productos
