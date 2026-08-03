function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function getRowColor(estado, prioridade) {
  if (estado === 'Tratado') return 'bg-green-50';
  if (estado === 'Em desenvolvimento') return 'bg-blue-50';
  if (prioridade === 'Urgente') return 'bg-red-50';
  return 'bg-yellow-50';
}

function getBadgeClasses(estado) {
  const base = 'inline-block px-2 py-1 rounded-full text-xs font-bold';
  switch (estado) {
    case 'Por tratar':
      return `${base} bg-yellow-200`;
    case 'Em desenvolvimento':
      return `${base} bg-blue-300`;
    case 'Tratado':
      return `${base} bg-green-300`;
    default:
      return `${base} bg-gray-200`;
  }
}

const COLUMNS = [
  'Título',
  'Responsável',
  'Data pedido',
  'Data execução',
  'Prioridade',
  'Estado',
  'Descrição',
  'Observações',
  'Ações',
];

export default function PedidoTable({
  pedidos,
  filtroEstado,
  filtroPrioridade,
  termoPesquisa,
  onEditar,
  onApagar,
  onAbrirUpdates,
}) {
  const filteredPedidos = pedidos
    .map((pedido, index) => ({ pedido, index }))
    .filter(({ pedido }) => {
      if (filtroEstado && filtroEstado !== 'Todos' && pedido.estado !== filtroEstado) {
        return false;
      }
      if (filtroPrioridade && filtroPrioridade !== 'Todas' && pedido.prioridade !== filtroPrioridade) {
        return false;
      }
      if (termoPesquisa) {
        const termo = termoPesquisa.toLowerCase();
        const campos = [pedido.titulo, pedido.responsavel, pedido.descricao, pedido.observacoes];
        if (!campos.some((c) => String(c || '').toLowerCase().includes(termo))) {
          return false;
        }
      }
      return true;
    });

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Lista de Pedidos</h2>

      {filteredPedidos.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          Não existem pedidos para os filtros selecionados.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-[#1f4e78] text-white sticky top-0">
                {COLUMNS.map((col) => (
                  <th key={col} className="p-2.5 text-left text-sm font-bold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map(({ pedido, index }) => (
                <tr key={index} className={getRowColor(pedido.estado, pedido.prioridade)}>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    {escapeHtml(pedido.titulo)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    {escapeHtml(pedido.responsavel)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top whitespace-nowrap">
                    {formatDate(pedido.dataPedido)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top whitespace-nowrap">
                    {formatDate(pedido.dataExecucao)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    {escapeHtml(pedido.prioridade)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    <span className={getBadgeClasses(pedido.estado)}>
                      {escapeHtml(pedido.estado)}
                    </span>
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    {escapeHtml(pedido.descricao)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top">
                    {escapeHtml(pedido.observacoes)}
                  </td>
                  <td className="p-2.5 border-b border-gray-200 align-top whitespace-nowrap">
                    <button
                      onClick={() => onEditar(index)}
                      className="bg-[#1f4e78] text-white px-3 py-1.5 rounded-md text-sm font-bold mr-1 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onApagar(index)}
                      className="bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-bold cursor-pointer"
                    >
                      Apagar
                    </button>
                    {pedido.estado === 'Em desenvolvimento' && (
                      <button
                        onClick={() => onAbrirUpdates(index)}
                        className="bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-bold ml-1 cursor-pointer"
                      >
                        📋 Updates
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
