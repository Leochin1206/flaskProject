import { useState } from "react";
import { ModalMetas } from "../components/modalMetas";
import { Plus } from "lucide-react";

export function Metas() {

     const [modalMetas, setModalMetas] = useState(false);

    return (
        <div className="flex flex-col items-end w-[100%] bg-[#FDFDFE]">
            <div className="flex flex-col items-center w-full sm:w-[88.5%]">
                <h1 className="text-[#1A2B4C] text-[30px] font-medium !mt-4  w-full">Metas</h1>

                <button onClick={() => setModalMetas(true)} className="flex items-center justify-center text-[20px] text-white font-medium rounded w-[80%] sm:w-[40%] !p-2 !mt-3 bg-[#3D7DDF]">
                    <Plus size={24} /> Adicionar Meta
                </button>

                <ModalMetas isOpen={modalMetas} onClose={() => setModalMetas(false)} />

                <div>
                    map das metas
                </div>
            </div>
        </div>
    );
}