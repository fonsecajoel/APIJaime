import { useState, useEffect } from 'react';

const inputClasses = 'w-full p-2.5 border border-gray-300 rounded-md text-base focus:border-[#1f4e78] focus:ring-1 focus:ring-[#1f4e78] outline-none transition-colors';
const labelClasses = 'font-bold block mb-1.5';

function RequiredMark() {
  return <span className="text-red-600 ml-0.5">*</span>;
}

export default function PedidoForm({ pedidoEdit, utilizadorAtual, onGuardar, onLimpar }) {
  const criarFormDataPadrao = () => ({
    titulo: '',
    responsavel: utilizadorAtual || '',
    dataPedido: '',
    dataExecucao: '',
    prioridade: 'Normal',
    estado: 'Por tratar',
    descricao: '',
    observacoes: '',
  });

  const [formData, setFormData] = useState(criarFormDataPadrao);

  useEffect(() => {
    if (pedidoEdit) {
      setFormData({
        titulo: pedidoEdit.titulo || '',
        responsavel: pedidoEdit.responsavel || '',
        dataPedido: pedidoEdit.dataPedido || '',
        dataExecucao: pedidoEdit.dataExecucao || '',
        prioridade: pedidoEdit.prioridade || 'Normal',
        estado: pedidoEdit.estado || 'Por tratar',
        descricao: pedidoEdit.descricao || '',
        observacoes: pedidoEdit.observacoes || '',
      });
    } else {
      setFormData({
        ...criarFormDataPadrao(),
        responsavel: utilizadorAtual || '',
      });
    }
  }, [pedidoEdit, utilizadorAtual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.responsavel.trim()) {
      alert('Por favor, preencha os campos obrigatórios: Título/Tópico e Responsável.');
      return;
    }
    onGuardar({
      ...formData,
      utilizador: utilizadorAtual,
    });
  };

  const handleLimpar = () => {
    setFormData({
      ...criarFormDataPadrao(),
      responsavel: utilizadorAtual || '',
    });
    if (onLimpar) onLimpar();
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-sm">
      <h3 className="text-lg font-bold mb-4">
        {pedidoEdit ? 'Editar Pedido' : 'Novo Pedido'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="titulo" className={labelClasses}>
              Título/Tópico<RequiredMark />
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="responsavel" className={labelClasses}>
              Responsável<RequiredMark />
            </label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              placeholder="Nome do responsável"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="dataPedido" className={labelClasses}>
              Data do pedido
            </label>
            <input
              type="date"
              id="dataPedido"
              name="dataPedido"
              value={formData.dataPedido}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="dataExecucao" className={labelClasses}>
              Data da execução
            </label>
            <input
              type="date"
              id="dataExecucao"
              name="dataExecucao"
              value={formData.dataExecucao}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="prioridade" className={labelClasses}>
              Prioridade
            </label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div>
            <label htmlFor="estado" className={labelClasses}>
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="Por tratar">Por tratar</option>
              <option value="Em desenvolvimento">Em desenvolvimento</option>
              <option value="Tratado">Tratado</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="descricao" className={labelClasses}>
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o endpoint, critérios de aceitação ou detalhes do pedido"
              className={`${inputClasses} min-h-[90px] resize-y`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="observacoes" className={labelClasses}>
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Notas adicionais, dependências ou referências"
              className={`${inputClasses} min-h-[90px] resize-y`}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="bg-[#1f4e78] text-white px-5 py-2.5 rounded-md text-base font-medium hover:bg-[#163a5c] transition-colors cursor-pointer"
          >
            Guardar Pedido
          </button>
          <button
            type="button"
            onClick={handleLimpar}
            className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-base font-medium hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}
