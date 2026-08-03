import { useState } from 'react';

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

export default function UpdateLog({ pedido, index, onAdicionarUpdate, onFechar }) {
  const [texto, setTexto] = useState('');

  if (!pedido) return null;

  const updates = pedido.updates || [];

  function handleSubmit() {
    const trimmed = texto.trim();
    if (!trimmed) return;
    onAdicionarUpdate(index, trimmed);
    setTexto('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onFechar}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold pr-4">
            Updates — {pedido.titulo}
          </h3>
          <button
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          {updates.length === 0 ? (
            <p className="text-gray-400 text-sm">Sem atualizações registadas.</p>
          ) : (
            updates.map((update, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
                <span className="text-xs text-gray-400 block mb-1">
                  {formatDateTime(update.data)}
                </span>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {update.texto}
                </p>
              </div>
            ))
          )}
        </div>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva uma atualização..."
          className="w-full border border-gray-300 rounded-md p-2.5 resize-y min-h-[80px] mb-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!texto.trim()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Update
        </button>
      </div>
    </div>
  );
}
