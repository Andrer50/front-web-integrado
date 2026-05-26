import { Users, Stethoscope, Activity, CreditCard } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Pacientes",
      value: "1,248",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Médicos Activos",
      value: "42",
      icon: Stethoscope,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Citas Hoy",
      value: "156",
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Ingresos Mensuales",
      value: "$12,450",
      icon: CreditCard,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Panel de Administración
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Bienvenido de nuevo. Aquí tienes un resumen de la actividad del
          sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={stat.color}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div
                className={`${stat.bg} ${stat.color} px-2.5 py-0.5 rounded-full text-xs font-bold`}
              >
                +12%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            Actividad Reciente
          </h2>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                  U{i}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Nuevo médico registrado
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Hace 2 horas • Dr. Ricardo Palma
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-medium">
              Gestionar Médicos
            </button>
            <button className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-medium">
              Reportes Generales
            </button>
            <button className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-medium">
              Auditoría de Logs
            </button>
            <button className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-medium">
              Configuración App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
