import logo from "../assets/logo.png";
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export function Cadastro() {
    const [nameUser, setNameUser] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const cadastrar = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            navigate('/home');
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar. Verifique os dados.");
        }
    };

    return (
        <div className="flex items-center justify-center h-[100vh] bg-[#FDFDFE]">
            <div className="flex items-center justify-evenly flex-col h-165 w-115 bg-white rounded shadow">
                <div className="flex items-center justify-center gap-2 font-bold">
                    <img src={logo} alt="" className="w-[42px]" />
                    <h1 className="text-[34px]">Finzy</h1>
                </div>
                <form className="flex flex-col items-center w-[85%]" onSubmit={cadastrar}>
                    <h1 className="font-bold text-[26px] text-[#1A2B4C] !mb-4">Cadastro</h1>

                    <div className="flex flex-col items-start w-full">
                        <label htmlFor="name" className="font-bold text-[15px] text-[#1A2B4C]">Nome completo:</label>
                        <input type="text" name="name" placeholder="nome..." value={nameUser} onChange={(e) => setNameUser(e.target.value)} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="email" className="font-bold text-[15px] text-[#1A2B4C]">E-mail:</label>
                        <input type="email" name="email" placeholder="e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="telefone" className="font-bold text-[15px] text-[#1A2B4C]">Telefone:</label>
                        <input type="text" name="telefone" placeholder="telefone..." value={telefone} onChange={(e) => setTelefone(e.target.value)} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="password" className="font-bold text-[15px] text-[#1A2B4C]">Senha:</label>
                        <input type="password" name="password" placeholder="senha..." value={password} onChange={(e) => setPassword(e.target.value)} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full !mt-3">
                        <label htmlFor="confirmPassword" className="font-bold text-[15px] text-[#1A2B4C]">Confirmar senha:</label>
                        <input type="password" name="confirmPassword" placeholder="confirmar senha..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <button type="submit" className="!p-2 w-[200px] rounded text-white font-bold text-[20px] bg-[#10B981] transition-all hover:scale-110 !mt-4">Cadastrar-se</button>
                </form>
                <h1 className="text-[18px] font-medium">Já tem Conta? <Link to="/" className="text-[#10B981]">Login</Link></h1>
            </div>
        </div>
    );
}
