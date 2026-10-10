import { useState } from 'react'

function Clientes({ clientes, setClientes, avisar }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')

  const agregar = () => {
    if (!nombre.trim()) {
      avisar('El nombre es obligatorio', true)
      return
    }
    const nuevoId = clientes.length ? Math.max(...clientes.map((c) => c.id)) + 1 : 1
    setClientes([...clientes, { id: nuevoId, nombre, telefono }])
    avisar('Cliente agregado')
    setNombre('')
    setTelefono('')
  }

  return (
    <div>
      <h2>Clientes</h2>
      <div className="panel formulario">
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <button className="btn" onClick={agregar}>Agregar</button>
      </div>

      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Teléfono</th></tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Clientes
