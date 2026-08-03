import { useState, useEffect, useRef } from 'react'
import { pedidosIniciais } from './data/initialData'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterTabs from './components/FilterTabs'
import PedidoForm from './components/PedidoForm'
import PedidoTable from './components/PedidoTable'
import UpdateLog from './components/UpdateLog'

function App() {
  const isInitialRender = useRef(true)

  const [pedidos, setPedidos] = useState(() => {
    try {
      const stored = localStorage.getItem('gestao_api_pedidos')
      const parsed = stored ? JSON.parse(stored) : null
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
      return pedidosIniciais
    } catch {
      return pedidosIniciais
    }
  })

  const [utilizadorAtual, setUtilizadorAtual] = useState(() => {
    try {
      return localStorage.getItem('gestao_api_utilizador') || ''
    } catch {
      return ''
    }
  })

  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState('Todas')
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [indiceEdicao, setIndiceEdicao] = useState(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    try { localStorage.setItem('gestao_api_pedidos', JSON.stringify(pedidos)) } catch {}
  }, [pedidos])

  useEffect(() => {
    try { localStorage.setItem('gestao_api_utilizador', utilizadorAtual) } catch {}
  }, [utilizadorAtual])

  const stats = {
    totalPedidos: pedidos.length,
    pendentes: pedidos.filter(p => p.estado === 'Por tratar').length,
    emDesenvolvimento: pedidos.filter(p => p.estado === 'Em desenvolvimento').length,
    tratados: pedidos.filter(p => p.estado === 'Tratado').length,
  }

  const guardarPedido = (pedido) => {
    const pedidoComUtilizador = { ...pedido, utilizador: utilizadorAtual }
    if (indiceEdicao === null) {
      setPedidos(prev => [pedidoComUtilizador, ...prev])
    } else {
      setPedidos(prev => {
        const novos = [...prev]
        novos[indiceEdicao] = pedidoComUtilizador
        return novos
      })
      setIndiceEdicao(null)
    }
  }

  const apagarPedido = (index) => {
    setPedidos(prev => prev.filter((_, i) => i !== index))
  }

  const editarPedido = (index) => {
    setIndiceEdicao(index)
  }

  const limparFormulario = () => {
    setIndiceEdicao(null)
  }

  const mudarFiltro = (estado) => {
    setFiltroEstado(estado)
  }

  const guardarUtilizador = (nome) => {
    setUtilizadorAtual(nome)
  }

  const reporDadosIniciais = () => {
    setPedidos(pedidosIniciais)
  }

  const abrirUpdates = (index) => {
    setPedidoSelecionado(index)
  }

  const fecharUpdates = () => {
    setPedidoSelecionado(null)
  }

  const adicionarUpdate = (index, texto) => {
    setPedidos(prev => {
      const novos = [...prev]
      const pedido = { ...novos[index] }
      pedido.updates = [...(pedido.updates || []), { texto, data: new Date().toISOString() }]
      novos[index] = pedido
      return novos
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        utilizadorAtual={utilizadorAtual}
        onGuardarUtilizador={guardarUtilizador}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
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
        <PedidoForm
          onGuardar={guardarPedido}
          pedidoEdit={indiceEdicao !== null ? pedidos[indiceEdicao] : null}
          utilizadorAtual={utilizadorAtual}
          onLimpar={limparFormulario}
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
      </div>
    </div>
  )
}

export default App
