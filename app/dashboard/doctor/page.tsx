import { Calendar, Users, Clipboard, Clock } from "lucide-react";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Panel del Médico
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Hoy tienes 8 citas programadas. 3 pacientes están esperando.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center gap-2 w-fit">
          <Calendar className="w-5 h-5" />
          Ver Calendario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Próximos Pacientes
              </h2>
              <span className="text-sm font-medium text-blue-600">
                Ver todos
              </span>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[
                {
                  name: "Juan Pérez",
                  time: "09:00 AM",
                  reason: "Control anual",
                  status: "Esperando",
                },
                {
                  name: "María Garcia",
                  time: "09:30 AM",
                  reason: "Consulta general",
                  status: "En camino",
                },
                {
                  name: "Carlos Ruiz",
                  time: "10:15 AM",
                  reason: "Revisión de resultados",
                  status: "Programado",
                },
              ].map((patient, i) => (
                <div
                  key={i}
                  className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {patient.name}
                      </p>
                      <p className="text-sm text-zinc-500">{patient.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {patient.time}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        patient.status === "Esperando"
                          ? "bg-green-100 text-green-600"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
              Métricas de Hoy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Atendidos
                  </span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">
                  5/8
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clipboard className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Recetas Emitidas
                  </span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">
                  12
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <h3 className="font-bold text-lg mb-2">Recordatorio</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              No olvides completar la historia clínica del paciente Carlos Ruiz
              antes de finalizar tu turno.
            </p>
            <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
              Ir a pendientes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
