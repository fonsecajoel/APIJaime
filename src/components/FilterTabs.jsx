const TABS = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Por tratar', value: 'Por tratar' },
  { label: 'Em desenvolvimento', value: 'Em desenvolvimento' },
  { label: 'Tratado', value: 'Tratado' },
];

export default function FilterTabs({
  filtroEstado,
  onMudarFiltro,
  filtroPrioridade,
  onMudarPrioridade,
  termoPesquisa,
  onMudarPesquisa,
  onReporDados,
}) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onMudarFiltro(tab.value)}
            className={`px-4 py-2 rounded-md font-bold cursor-pointer transition-colors ${
              filtroEstado === tab.value
                ? 'bg-[#1f4e78] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => {
            if (window.confirm('Tem a certeza que deseja repor os dados iniciais? Os pedidos atuais serão substituídos.')) {
              onReporDados();
            }
          }}
          className="px-4 py-2 rounded-md font-bold cursor-pointer transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Repor dados iniciais
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-bold block mb-1.5">Pesquisar</label>
          <input
            type="text"
            value={termoPesquisa}
            onChange={(e) => onMudarPesquisa(e.target.value)}
            placeholder="Pesquisar por título, responsável, descrição..."
            className="w-full p-2.5 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="font-bold block mb-1.5">Prioridade</label>
          <select
            value={filtroPrioridade}
            onChange={(e) => onMudarPrioridade(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md"
          >
            <option value="Todas">Todas</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
