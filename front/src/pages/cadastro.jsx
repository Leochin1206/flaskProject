import logo from "../assets/logo.png";
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export function Cadastro() {
    const [formData, setFormData] = useState({
        nameUser: "",
        email: "",
        telefone: "",
        password: "",
        confirmPassword: "",

    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const cadastrar = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            console.log(formData)
            navigate('/home');
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar. Verifique os dados.");
        }
    };

    const campos = [
        {
            labelText: "Nome",
            id: "nameUser",
            placeholder: "Digite seu nome",
            type: "text",
        },
        {
            labelText: "Email",
            id: "email",
            placeholder: "Digite seu email",
            type: "email",
        },
        {
            labelText: "Telefone",
            id: "telefone",
            placeholder: "Digite seu telefone",
            type: "tel",
        },
        {
            labelText: "Senha",
            id: "password",
            placeholder: "Digite sua senha",
            type: "password",
        },
        {
            labelText: "Confirmar senha",
            id: "confirmPassword",
            placeholder: "Confirme sua senha",
            type: "password",
        },
    ];

    return (
        <div className="flex items-center justify-center h-[100vh] bg-[#FDFDFE]">
            <div className="flex items-center justify-evenly flex-col h-165 w-115 bg-white rounded shadow">
                <div className="flex items-center justify-center gap-2 font-bold">
                    <img src={logo} alt="" className="w-[42px]" />
                    <h1 className="text-[34px]">Finzy</h1>
                </div>
                <form className="flex flex-col items-center w-[85%]" onSubmit={cadastrar}>
                    <h1 className="font-bold text-[26px] text-[#1A2B4C] !mb-4">Cadastro</h1>

                    {campos.map((campo) => (
                        <div className="flex flex-col items-start w-full !mb-3">
                            <label htmlFor={campo.id} className="font-bold text-[15px] text-[#1A2B4C]">{campo.labelText}</label>
                            <input type={campo.type} name={campo.id} placeholder={campo.placeholder} value={formData[campo.id]} onChange={handleChange} className="!p-2 border-1 border-gray-300 w-full rounded shadow text-gray-500" required />
                        </div>
                    ))}

                    <button type="submit" className="!p-2 w-[200px] rounded text-white font-bold text-[20px] bg-[#10B981] transition-all hover:scale-110 !mt-4">Cadastrar-se</button>
                </form>
                <h1 className="text-[18px] font-medium">Já tem Conta? <Link to="/" className="text-[#10B981]">Login</Link></h1>
            </div>
        </div>
    );
}
