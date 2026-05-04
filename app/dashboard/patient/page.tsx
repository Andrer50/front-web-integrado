import { Calendar, FileText, Pill, HeartPulse } from "lucide-react";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <HeartPulse className="w-12 h-12" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            ¡Hola, Juan!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            Tu salud está en buenas manos. Tienes una cita programada para mañana.
          </p>
        </div>
        <button className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-8 py-3 rounded-2xl font-bold transition-transform hover:scale-105">
          Agendar Cita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Próxima Cita", value: "Mañana 10:00 AM", detail: "Dr. Carlos Ruiz - Cardiología", icon: Calendar, color: "bg-blue-500" },
          { title: "Recetas Activas", value: "2 Medicamentos", detail: "Amoxicilina, Ibuprofeno", icon: Pill, color: "bg-green-500" },
          { title: "Resultados", value: "Pendientes", detail: "Análisis de sangre", icon: FileText, color: "bg-purple-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform group-hover:scale-150 ${item.color}`}></div>
            <item.icon className="w-8 h-8 mb-4 text-zinc-400" />
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.title}</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1">{item.value}</h3>
            <p className="text-sm text-zinc-400 mt-2">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Mi Historial Reciente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex gap-6 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-500">
                  <span className="text-xs font-bold uppercase">Abr</span>
                  <span className="text-xl font-black">1{i+2}</span>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white">Consulta General</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Dr. Ricardo Palma • Clínica San Felipe
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg">Ver Diagnóstico</button>
                    <button className="text-xs font-semibold px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg">Descargar PDF</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
