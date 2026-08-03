export default function StatsBar({ stats }) {
  const cards = [
    { label: 'Total', value: stats.totalPedidos, bg: 'bg-blue-50 text-blue-800' },
    { label: 'Por tratar', value: stats.pendentes, bg: 'bg-yellow-50 text-yellow-800' },
    { label: 'Em desenvolvimento', value: stats.emDesenvolvimento, bg: 'bg-blue-100 text-blue-800' },
    { label: 'Tratados', value: stats.tratados, bg: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {cards.map((card) => (
        <div key={card.label} className={`p-4 rounded-lg text-center font-bold ${card.bg}`}>
          <span className="text-sm">{card.label}</span>
          <span className="text-2xl block mt-1">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
