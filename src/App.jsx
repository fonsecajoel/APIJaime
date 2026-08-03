import { useState, useEffect, useCallback, useRef } from 'react'
import { getPedidos, savePedidos } from './redis'
import { pedidosIniciais } from './data/initialData'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterTabs from './components/FilterTabs'
import PedidoForm from './components/PedidoForm'
import PedidoTable from './components/PedidoTable'
import UpdateLog from './components/UpdateLog'

const POLL_INTERVAL = 2000

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(key) || fallback }
    catch { return fallback }
  })
  useEffect(() => {
    try { localStorage.setItem(key, value) } catch {}
  }, [key, value])
  return [value, setValue]
}

function App() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [utilizadorAtual, setUtilizadorAtual] = useLocalStorage('gestao_api_utilizador', '')

  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState('Todas')
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [indiceEdicao, setIndiceEdicao] = useState(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)

  const pedidosRef = useRef(pedidos)
  pedidosRef.current = pedidos

  const carregarPedidos = useCallback(async () => {
    const data = await getPedidos()
    if (data !== null) {
      setPedidos(data)
    } else if (pedidosRef.current.length === 0) {
      setPedidos(pedidosIniciais)
      savePedidos(pedidosIniciais)
    }
    setLoading(false)
  }, [])

  const persistir = useCallback(async (novosPedidos) => {
    setPedidos(novosPedidos)
    savePedidos(novosPedidos)
  }, [])

  useEffect(() => {
    carregarPedidos()
    const interval = setInterval(carregarPedidos, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [carregarPedidos])

  const stats = {
    totalPedidos: pedidos.length,
    pendentes: pedidos.filter(p => p.estado === 'Por tratar').length,
    emDesenvolvimento: pedidos.filter(p => p.estado === 'Em desenvolvimento').length,
    tratados: pedidos.filter(p => p.estado === 'Tratado').length,
  }

  const guardarPedido = useCallback((pedido) => {
    const novo = {
      ...pedido,
      id: pedido.id || Date.now(),
      responsavel: pedido.responsavel || utilizadorAtual,
      utilizador: utilizadorAtual,
      updates: pedido.updates || [],
    }

    let novos
    if (indiceEdicao !== null) {
      novos = [...pedidosRef.current]
      novos[indiceEdicao] = novo
      setIndiceEdicao(null)
    } else {
      novos = [novo, ...pedidosRef.current]
    }
    persistir(novos)
  }, [indiceEdicao, utilizadorAtual, persistir])

  const apagarPedido = useCallback((index) => {
    const novos = pedidosRef.current.filter((_, i) => i !== index)
    persistir(novos)
  }, [persistir])

  const editarPedido = useCallback((index) => {
    setIndiceEdicao(index)
  }, [])

  const limparFormulario = useCallback(() => {
    setIndiceEdicao(null)
  }, [])

  const mudarFiltro = useCallback((estado) => {
    setFiltroEstado(estado)
  }, [])

  const reporDadosIniciais = useCallback(() => {
    persistir(pedidosIniciais)
  }, [persistir])

  const abrirUpdates = useCallback((index) => {
    setPedidoSelecionado(index)
  }, [])

  const fecharUpdates = useCallback(() => {
    setPedidoSelecionado(null)
  }, [])

  const adicionarUpdate = useCallback((index, texto) => {
    const novos = [...pedidosRef.current]
    const pedido = { ...novos[index] }
    pedido.updates = [...(pedido.updates || []), { texto, data: new Date().toISOString() }]
    novos[index] = pedido
    persistir(novos)
  }, [persistir])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        utilizadorAtual={utilizadorAtual}
        onGuardarUtilizador={setUtilizadorAtual}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-400 py-12">A carregar...</p>
        ) : (
          <>
            <PedidoForm
              onGuardar={guardarPedido}
              pedidoEdit={indiceEdicao !== null ? pedidos[indiceEdicao] : null}
              utilizadorAtual={utilizadorAtual}
              onLimpar={limparFormulario}
            />
            <StatsBar stats={stats} />
            <FilterTabs
              filtroEstado={filtroEstado}
              onMudarFiltro={mudarFiltro}
              filtroPrioridade={filtroPrioridade}
              onMudarPrioridade={setFiltroPrioridade}
              termoPesquisa={termoPesquisa}
              onMudarPesquisa={setTermoPesquisa}
              onReporDados={reporDadosIniciais}
            />
            <PedidoTable
              pedidos={pedidos}
              filtroEstado={filtroEstado}
              filtroPrioridade={filtroPrioridade}
              termoPesquisa={termoPesquisa}
              onEditar={editarPedido}
              onApagar={apagarPedido}
              onAbrirUpdates={abrirUpdates}
            />
            <UpdateLog
              pedido={pedidoSelecionado !== null ? pedidos[pedidoSelecionado] : null}
              index={pedidoSelecionado}
              onAdicionarUpdate={adicionarUpdate}
              onFechar={fecharUpdates}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
