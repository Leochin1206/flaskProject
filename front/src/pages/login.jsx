import logo from "../assets/logo.png"
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


export function Login() {
    const [formData, setFormData] = useState({
        nome: "",
        senha: "",
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    

    const logar = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', {
                nome: formData.nome,
                senha: formData.senha
            });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            console.log(response.data.access)
            navigate('/home');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Usuário ou senha incorretos. Tente novamente.");
        }
    };
    
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-[100vh] bg-[#FDFDFE]">
            <div className="flex items-center justify-evenly flex-col h-111 w-100 bg-white rounded shadow">
                <div className="flex items-center justify-center gap-2 font-bold">
                    <img src={logo} alt="" className="w-[42px]" />
                    <h1 className="text-[34px]">Finzy</h1>
                </div>
                <form className="flex flex-col items-center w-[85%]" onSubmit={logar}>
                    <h1 className="font-bold text-[26px] text-[#1A2B4C] !mb-4">Login</h1>
                    <div className="flex flex-col items-start w-full">
                        <label htmlFor="nome" className="font-bold text-[15px] text-[#1A2B4C]">Nome:</label>
                        <input type="text" name="nome" placeholder="nome..." value={formData.nome} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <label htmlFor="senha" className="font-bold text-[15px] text-[#1A2B4C] !mt-3">Senha:</label>
                        <input type="password" name="senha" placeholder="senha..." value={formData.senha} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                    </div>

                    <button type="submit" className="!p-2 w-[200px] rounded text-white font-bold text-[20px] bg-[#10B981] transition-all hover:scale-110 !mt-4">Entrar</button>
                </form>
                <h1 className="text-[18px] font-medium">Não tem uma Conta? <Link to="/cadastro" className="text-[#10B981]">Cadastre-se</Link></h1>
            </div>
        </div>
    );
}