function Header({ utilizadorAtual, onGuardarUtilizador }) {
  return (
    <header className="bg-[#1f4e78] text-white p-5 flex justify-between items-center flex-wrap gap-3">
      <h1 className="text-xl font-bold">Gestão de Desenvolvimento da API</h1>

      <div className="flex items-center gap-2.5 text-sm">
        <label htmlFor="userInput" className="text-sm font-normal whitespace-nowrap">
          Utilizador:
        </label>
        <input
          id="userInput"
          type="text"
          placeholder="Escreva o seu nome…"
          defaultValue={utilizadorAtual}
          onBlur={(e) => onGuardarUtilizador(e.target.value.trim())}
          className="w-44 px-2.5 py-1.5 border border-blue-300 rounded-md text-gray-800 text-sm"
        />
        <span className="bg-white text-[#1f4e78] px-3 py-1 rounded-full font-bold text-sm">
          {utilizadorAtual || "(sem utilizador)"}
        </span>
      </div>
    </header>
  );
}

export default Header;
