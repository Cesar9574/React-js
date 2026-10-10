import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import Productos from './components/Productos'
import Clientes from './components/Clientes'
import NuevaVenta from './components/NuevaVenta'
import Historial from './components/Historial'

// Datos de ejemplo para que el sistema no empiece vacío
const productosIniciales = [
  { id: 1, nombre: 'Martillo de acero', categoria: 'Herramientas', precio: 55, stock: 20 },
  { id: 2, nombre: 'Destornillador plano', categoria: 'Herramientas', precio: 18, stock: 40 },
  { id: 3, nombre: 'Clavos 2 pulgadas (libra)', categoria: 'Construcción', precio: 9, stock: 100 },
  { id: 4, nombre: 'Cemento 42.5 kg', categoria: 'Construcción', precio: 82, stock: 50 },
  { id: 5, nombre: 'Pintura blanca galón', categoria: 'Pinturas', precio: 140, stock: 12 },
  { id: 6, nombre: 'Cable eléctrico #12 (metro)', categoria: 'Electricidad', precio: 6.5, stock: 200 },
  { id: 7, nombre: 'Tubo PVC 1/2"', categoria: 'Plomería', precio: 25, stock: 3 },
]
const clientesIniciales = [{ id: 1, nombre: 'Cliente General', telefono: '00000000' }]

function App() {
  // Estado principal del sistema (se guarda en localStorage)
  const [productos, setProductos] = useLocalStorage('ferreteria_productos', productosIniciales)
  const [clientes, setClientes] = useLocalStorage('ferreteria_clientes', clientesIniciales)
  const [ventas, setVentas] = useLocalStorage('ferreteria_ventas', [])

  const [pestana, setPestana] = useState('productos')
  const [mensaje, setMensaje] = useState({ texto: '', error: false })

  // Función para mostrar mensajes verdes (bien) o rojos (error)
  const avisar = (texto, error = false) => setMensaje({ texto, error })

  const cambiarPestana = (nombre) => {
    setPestana(nombre)
    setMensaje({ texto: '', error: false })
  }

  const botones = [
    ['productos', 'Productos'],
    ['clientes', 'Clientes'],
    ['venta', 'Nueva venta'],
    ['historial', 'Historial'],
  ]

  return (
    <div className="layout">
      {/* Barra lateral con el menú */}
      <aside className="lateral">
        <div className="marca">
          <h1>Ferretería</h1>
          <p>Inventario y ventas</p>
        </div>

        <nav>
          {botones.map(([clave, texto]) => (
            <button
              key={clave}
              className={pestana === clave ? 'activo' : ''}
              onClick={() => cambiarPestana(clave)}
            >
              {texto}
            </button>
          ))}
        </nav>

        <p className="resumen">
          {productos.length} productos<br />
          {ventas.length} ventas registradas
        </p>
      </aside>

      {/* Contenido principal */}
      <main>
        {mensaje.texto && (
          <p className={mensaje.error ? 'aviso error' : 'aviso ok'}>{mensaje.texto}</p>
        )}

        {pestana === 'productos' && (
          <Productos productos={productos} setProductos={setProductos} ventas={ventas} avisar={avisar} />
        )}
        {pestana === 'clientes' && (
          <Clientes clientes={clientes} setClientes={setClientes} avisar={avisar} />
        )}
        {pestana === 'venta' && (
          <NuevaVenta
            productos={productos}
            setProductos={setProductos}
            clientes={clientes}
            ventas={ventas}
            setVentas={setVentas}
            avisar={avisar}
          />
        )}
        {pestana === 'historial' && <Historial ventas={ventas} />}
      </main>
    </div>
  )
}

export default App
