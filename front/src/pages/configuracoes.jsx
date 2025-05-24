import { ConfigUsuario } from "../components/configUsuario";
import { useState } from "react";

export function Configuracoes() {
  const [formData, setFormData] = useState({
    nameUser: "",
    email: "",
    telefone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const configSetting = async () => {
    try {
      console.log("Dados enviados:", formData);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha incorretos. Tente novamente.");
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
  ];

  return (
    <div className="flex flex-col items-end w-full bg-[#FDFDFE] h-[100vh]">
      <div className="flex flex-col w-full sm:w-[88%]">
        <h1 className="text-[#1A2B4C] text-[30px] font-medium !mt-4 !ml-2">
          Configurações
        </h1>
        <form onSubmit={configSetting}>
          {campos.map((campo) => (
            <ConfigUsuario
              key={campo.id}
              labelText={campo.labelText}
              componentId={campo.id}
              type={campo.type}
              placeholder={campo.placeholder}
              value={formData[campo.id]}
              onChange={handleChange}
            />
          ))}

          <button className="bg-[#1A2B4C] text-white font-medium !p-2 rounded w-[100px] !mt-4 !ml-6" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}
