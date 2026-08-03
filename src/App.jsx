import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { pedidosIniciais } from './data/initialData'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterTabs from './components/FilterTabs'
import PedidoForm from './components/PedidoForm'
import PedidoTable from './components/PedidoTable'
import UpdateLog from './components/UpdateLog'

function App() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [utilizadorAtual, setUtilizadorAtual] = useState(() => {
    try { return localStorage.getItem('gestao_api_utilizador') || '' }
    catch { return '' }
  })

  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState('Todas')
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [indiceEdicao, setIndiceEdicao] = useState(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)

  const fromDb = (row) => ({
    id: row.id,
    titulo: row.titulo,
    responsavel: row.responsavel,
    dataPedido: row.data_pedido,
    dataExecucao: row.data_execucao,
    prioridade: row.prioridade,
    estado: row.estado,
    descricao: row.descricao,
    observacoes: row.observacoes,
    utilizador: row.utilizador,
    updates: row.updates || [],
  })

  useEffect(() => {
    let mounted = true

    async function carregar() {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('Erro ao carregar pedidos:', error)
        setPedidos(pedidosIniciais)
      } else if (data && data.length > 0) {
        setPedidos(data.map(fromDb))
      } else {
        setPedidos(pedidosIniciais)
      }
      setLoading(false)
    }

    carregar()

    const channel = supabase
      .channel('pedidos-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
          if (!mounted) return
          const row = payload.new

          switch (payload.eventType) {
            case 'INSERT':
              setPedidos(prev => [fromDb(row), ...prev])
              break
            case 'UPDATE':
              setPedidos(prev => prev.map(p =>
                p.id === row.id ? { ...p, ...fromDb(row) } : p
              ))
              break
            case 'DELETE':
              setPedidos(prev => prev.filter(p => p.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('gestao_api_utilizador', utilizadorAtual) } catch {}
  }, [utilizadorAtual])

  const stats = {
    totalPedidos: pedidos.length,
    pendentes: pedidos.filter(p => p.estado === 'Por tratar').length,
    emDesenvolvimento: pedidos.filter(p => p.estado === 'Em desenvolvimento').length,
    tratados: pedidos.filter(p => p.estado === 'Tratado').length,
  }

  const guardarPedido = useCallback(async (pedido) => {
    const dbPedido = {
      titulo: pedido.titulo,
      responsavel: pedido.responsavel || utilizadorAtual,
      data_pedido: pedido.dataPedido || '',
      data_execucao: pedido.dataExecucao || '',
      prioridade: pedido.prioridade || 'Normal',
      estado: pedido.estado || 'Por tratar',
      descricao: pedido.descricao || '',
      observacoes: pedido.observacoes || '',
      utilizador: utilizadorAtual,
      updates: pedido.updates || [],
    }

    if (indiceEdicao !== null) {
      const id = pedidos[indiceEdicao]?.id
      if (id) {
        await supabase.from('pedidos').update(dbPedido).eq('id', id)
      }
      setIndiceEdicao(null)
    } else {
      await supabase.from('pedidos').insert(dbPedido)
    }
  }, [indiceEdicao, pedidos, utilizadorAtual])

  const apagarPedido = useCallback(async (index) => {
    const id = pedidos[index]?.id
    if (id) {
      await supabase.from('pedidos').delete().eq('id', id)
    }
  }, [pedidos])

  const editarPedido = useCallback((index) => {
    setIndiceEdicao(index)
  }, [])

  const limparFormulario = useCallback(() => {
    setIndiceEdicao(null)
  }, [])

  const mudarFiltro = useCallback((estado) => {
    setFiltroEstado(estado)
  }, [])

  const guardarUtilizador = useCallback((nome) => {
    setUtilizadorAtual(nome)
  }, [])

  const reporDadosIniciais = useCallback(async () => {
    await supabase.from('pedidos').delete().neq('id', 0)
    for (const p of pedidosIniciais) {
      await supabase.from('pedidos').insert({
        titulo: p.titulo,
        responsavel: p.responsavel,
        data_pedido: p.dataPedido,
        data_execucao: p.dataExecucao,
        prioridade: p.prioridade,
        estado: p.estado,
        descricao: p.descricao,
        observacoes: p.observacoes,
        utilizador: '',
        updates: [],
      })
    }
  }, [])

  const abrirUpdates = useCallback((index) => {
    setPedidoSelecionado(index)
  }, [])

  const fecharUpdates = useCallback(() => {
    setPedidoSelecionado(null)
  }, [])

  const adicionarUpdate = useCallback(async (index, texto) => {
    const pedido = pedidos[index]
    if (!pedido?.id) return
    const novosUpdates = [...(pedido.updates || []), { texto, data: new Date().toISOString() }]
    await supabase.from('pedidos').update({ updates: novosUpdates }).eq('id', pedido.id)
  }, [pedidos])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        utilizadorAtual={utilizadorAtual}
        onGuardarUtilizador={guardarUtilizador}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-gray-400 py-12">A carregar...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default App
