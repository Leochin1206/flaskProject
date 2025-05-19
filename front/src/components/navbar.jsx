import { Link } from "react-router-dom";
import React, { useState } from "react";
import { House, LogOut, ArrowLeftRight, Receipt, Goal, User, AlignJustify, Flag, Cog } from 'lucide-react';
import logo from "../assets/logo.png"

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const linkNav = [
        {
            img: <House size={31} />,
            link: "/home",
            altImg: "Ícone para localizar a página Home",
            titulo: "Dashboards"
        },
        {
            img: <ArrowLeftRight size={30} />,
            link: "/transacoes",
            altImg: "Ícone para acessar a seção Transações",
            titulo: "Transações"
        },
        {
            img: <Receipt size={30} />,
            link: "/orcamentos",
            altImg: "Ícone para acessar os Orçamentos",
            titulo: "Orçamentos"
        },
        {
            img: <Goal size={30} />,
            link: "/metas",
            altImg: "Ícone para acessar o Metas",
            titulo: "Metas"
        },
        {
            img: <Flag size={30} />,
            link: "/relatorios",
            altImg: "Ícone para acessar o Relatórios",
            titulo: "Relatórios"
        },
        {
            img: <Cog size={30} />,
            link: "/configuracoes",
            altImg: "Ícone para acessar o Configurações",
            titulo: "Configurações"
        },
        {
            img: <LogOut size={30} />,
            link: "/",
            altImg: "Ícone para sair da plataforma",
            titulo: "Sair",
            onClick: () => {
                localStorage.removeItem("token");
                setMenuOpen(false);
            }
        }
    ];

    return (
        <nav className="text-white">
            {/* Mobile Header */}
            <div className="sm:hidden !p-4 bg-[#1A2B4C] shadow-right flex justify-between items-center">
                <div className="flex items-center justify-center gap-2 sm:text-[21px] md:text-[24px] font-bold sm:!mb-5">
                    <img src={logo} alt="" className="w-[32px]" />
                    <h1 className="text-[24px]">Finzy</h1>
                </div>
                <button onClick={toggleMenu}>
                    <AlignJustify />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <ul className="z-20 absolute sm:hidden bg-[#1A2B4C] px-6 pb-4 flex flex-col gap-4 shadow-md top-16 w-full">
                    {linkNav.map((nav, index) => (
                        <Link
                            key={index}
                            to={nav.link}
                            onClick={() => {
                                if (nav.onClick) nav.onClick();
                                else setMenuOpen(false);
                            }}
                        >
                            <li className="hover:scale-105 transition-all !p-2">
                                <p className="!ml-7 text-[18px] font-medium">{nav.titulo}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}

            {/* Sidebar Menu */}
            <div className="hidden sm:flex flex-col w-50 h-[100vh] bg-[#1A2B4C] shadow-right !p-4 fixed top-0">
                <div className="flex items-center justify-center gap-2 sm:text-[21px] md:text-[24px] font-bold sm:!mb-5">
                    <img src={logo} alt="" className="w-[42px]" />
                    <h1 className="text-[34px]">Finzy</h1>
                </div>
                <ul className="flex flex-col gap-5">
                    {linkNav.map((nav, index) => (
                        <Link
                            key={index}
                            to={nav.link}
                            onClick={() => {
                                if (nav.onClick) nav.onClick();
                            }}
                        >
                            <li className="flex items-center justify-start hover:scale-105 transition-all px-4 py-2 !p-1 rounded-md cursor-pointer gap-1.5">
                                <div aria-label={nav.altImg}>
                                    {nav.img}
                                </div>
                                <p className="sm:text-[15px] md:text-[17px] !mt-0.5 font-medium">{nav.titulo}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
