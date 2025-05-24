export function ConfigUsuario({labelText, componentId, ...props}) {
  return (
    <div className="flex flex-col !ml-6 !mt-5 w-[85%] sm:w-[40%] bg-white shadow rounded !p-3">
      <label htmlFor={componentId} className="text-[#1A2B4C] font-medium text-[18px]">{labelText}</label>
      <input id={componentId} name={componentId} className="bg-[#F4F6F9] !p-2 rounded" {...props} required/>
    </div>
  );
}
