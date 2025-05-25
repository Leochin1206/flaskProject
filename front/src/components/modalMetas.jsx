import { useState } from "react";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import {
    Utensils,
    Car,
    Home,
    Gamepad2,
    HeartPulse,
    BookOpen,
    ShoppingCart,
    BadgeDollarSign,
    Wallet,
    TrendingUp,
    Banknote,
    Gift,
    FileText,
    Plane,
    PawPrint,
    MoreHorizontal,
    ChevronDown,
    Check
} from "lucide-react";


export function ModalMetas({ isOpen, onClose }) {
    const metasTipo = [
        { nome: "Alimentação", icone: <Utensils size={22} />, value: "alimentacao" },
        { nome: "Transporte", icone: <Car size={22} />, value: "transporte" },
        { nome: "Moradia", icone: <Home size={22} />, value: "moradia" },
        { nome: "Lazer", icone: <Gamepad2 size={22} />, value: "lazer" },
        { nome: "Saúde", icone: <HeartPulse size={22} />, value: "saude" },
        { nome: "Educação", icone: <BookOpen size={22} />, value: "educacao" },
        { nome: "Compras", icone: <ShoppingCart size={22} />, value: "compras" },
        { nome: "Assinaturas", icone: <BadgeDollarSign size={22} />, value: "assinaturas" },
        { nome: "Salário", icone: <Wallet size={22} />, value: "salario" },
        { nome: "Investimentos", icone: <TrendingUp size={22} />, value: "investimentos" },
        { nome: "Dívidas", icone: <Banknote size={22} />, value: "dividas" },
        { nome: "Presentes", icone: <Gift size={22} />, value: "presentes" },
        { nome: "Impostos", icone: <FileText size={22} />, value: "impostos" },
        { nome: "Viagens", icone: <Plane size={22} />, value: "viagens" },
        { nome: "Pets", icone: <PawPrint size={22} />, value: "pets" },
        { nome: "Outro", icone: <MoreHorizontal size={22} />, value: "outro" }
    ];

    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const handleCategoriaChange = (value) => {
        const selecionada = metasTipo.find((item) => item.value === value);
        setCategoriaSelecionada(selecionada);
        setFormData({ ...formData, categoria: value });
    };

    const [formData, setFormData] = useState({
        nomeMeta: "",
        descricao: "",
        categoria: "",
        valorObjetivo: "",
        dataLimite: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cadastrarMeta = async (e) => {
        e.preventDefault();

        try {
            console.log(formData)
            alert("Meta adicionada com sucesso!")
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar. Verifique os dados.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500/30 z-50">
            <div className="bg-white rounded-lg !p-6 lg:!p-8 w-[400px] sm:w-[510px] lg:w-[640px] xl:w-[800px] shadow-lg">
                <h1 className="text-[20px] text-[#1A2B4C] font-medium">Nova Meta</h1>
                <form onSubmit={cadastrarMeta}>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="nomeMeta" className="font-bold text-[15px] text-[#1A2B4C]">Nome Meta:</label>
                        <input type="text" name="nomeMeta" placeholder="nome meta..." value={formData.nomeMeta} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="descricao" className="font-bold text-[15px] text-[#1A2B4C]">Descrição:</label>
                        <input type="text" name="descricao" placeholder="descrição..." value={formData.descricao} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col w-full !mt-3">
                        <label className="font-bold text-[15px] text-[#1A2B4C] !mb-1">Categoria:</label>
                        <Listbox value={formData.categoria} onChange={handleCategoriaChange}>
                            <div className="relative w-full">
                                <Listbox.Button className="w-full py-2 !pl-3 !p-2 text-left bg-white rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400">
                                    <span className="flex items-center gap-2 text-gray-700">
                                        {categoriaSelecionada ? (
                                            <>{categoriaSelecionada.icone} {categoriaSelecionada.nome}</>
                                        ) : (
                                            <span className="text-gray-400">Selecione uma categoria</span>
                                        )}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 flex items-center !pr-2">
                                        <ChevronDown size={20} />
                                    </span>
                                </Listbox.Button>

                                <Listbox.Options className="absolute z-10 w-full max-h-60 overflow-auto rounded bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    {metasTipo.map((item) => (
                                        <Listbox.Option key={item.value} value={item.value}
                                            className={({ active }) => `cursor-default select-none py-2 !pl-8 flex items-center gap-2 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`}>
                                            {({ selected }) => (
                                                <>
                                                    <span className="flex items-center gap-2 !p-1">{item.icone} {item.nome}</span>
                                                    {selected && (<span className="absolute left-2 text-blue-600"><Check size={16} /></span>)}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>


                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="valor" className="font-bold text-[15px] text-[#1A2B4C]">Valor Objetivo:</label>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">R$</span>
                            <input type="number" name="valorObjetivo" id="valorObjetivo" placeholder="0,00" value={formData.valorObjetivo} onChange={handleChange} required
                                className="!pl-10 !p-2 border border-gray-300 w-full rounded shadow text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="dataLimite" className="font-bold text-[15px] text-[#1A2B4C]">Data Limite:</label>
                        <input type="date" name="dataLimite" value={formData.dataLimite} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex justify-end gap-4 !mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-4 py-2 rounded-md !p-2">Cancelar</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md !p-2">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}