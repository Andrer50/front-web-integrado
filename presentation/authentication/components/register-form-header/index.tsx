import { BriefcaseMedical } from "lucide-react";

export default function RegisterFormHeader() {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="w-14 h-14 bg-blanco-azulado rounded-xl flex items-center justify-center mb-5">
        <BriefcaseMedical className="text-petroleo w-7 h-7" />
      </div>
      <h1 className="text-2xl sm:text-[26px] font-bold text-petroleo tracking-tight mb-2">
        MediConnect
      </h1>
      <p className="text-[13px] text-gray-500 text-center font-medium">
        Crea tu cuenta de paciente
      </p>
    </div>
  );
}
