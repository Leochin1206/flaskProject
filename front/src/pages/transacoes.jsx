import { useState } from "react";
import { ModalTransacao } from "../components/modalTransacao";
import { Plus } from "lucide-react";

export function Transacoes() {
  const [modalTransacao, setModalTransacao] = useState(false);
  const [filtro, setFiltro] = useState("24h");

  const transacoes = [];

  const agora = new Date();
  const filtrarPorData = (dataTransacao) => {
    const data = new Date(dataTransacao);
    const diffHoras = (agora - data) / (1000 * 60 * 60);
    if (filtro === "24h") return diffHoras <= 24;
    if (filtro === "7d") return diffHoras <= 168; 
    if (filtro === "30d") return diffHoras <= 720; 
    return true;
  };

  const transacoesFiltradas = transacoes.filter((t) => filtrarPorData(t.data));

  return (
    <div className="flex flex-col items-end w-[100%] bg-[#FDFDFE]">
      <div className="flex flex-col items-center w-full sm:w-[88.5%]">
        <h1 className="text-[#1A2B4C] text-[30px] font-medium !mt-4  w-full">Transações</h1>

        <div className="flex items-center justify-between gap-2 w-[80%] sm:w-[40%] border border-gray-300 rounded !p-1 !mt-3">
          <button onClick={() => setFiltro("24h")} className="text-[18px] text-gray-600 font-medium w-[33.3%] !p-1">Hoje</button>
          <button onClick={() => setFiltro("7d")} className="text-[18px] text-gray-600 font-medium w-[33.3%] border-l-1 border-r-1 border-gray-300 !p-1">Semana</button>
          <button onClick={() => setFiltro("30d")} className="text-[18px] text-gray-600 font-medium w-[33.3%] !p-1">Mês</button>
        </div>

        <button onClick={() => setModalTransacao(true)} className="flex items-center justify-center text-[20px] text-white font-medium rounded w-[80%] sm:w-[40%] !p-2 !mt-3 bg-[#3D7DDF]">
          <Plus size={24}/> Adicionar Transação
        </button>

        <ModalTransacao isOpen={modalTransacao} onClose={() => setModalTransacao(false)} />

        <div>
          map das transacoes FILTRADAS
        </div>
      </div>
    </div>
  );
}
