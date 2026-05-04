import { 
  Plus, 
  Filter, 
  MoreVertical, 
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Search
} from "lucide-react";

export default function AdminPatientsPage() {
  const patients = [
    {
      id: "PAT-2034",
      name: "Juan Pérez García",
      dni: "72345678",
      email: "j.perez@gmail.com",
      phone: "+51 987 654 321",
      status: "ACTIVO",
      gender: "Masculino",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "PAT-8821",
      name: "María Rodríguez Luna",
      dni: "45678901",
      email: "m.rodriguez@outlook.com",
      phone: "+51 912 345 678",
      status: "ACTIVO",
      gender: "Femenino",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "PAT-3345",
      name: "Carlos Mendoza Ruiz",
      dni: "12345672",
      email: "c.mendoza@gmail.com",
      phone: "+51 933 445 566",
      status: "INACTIVO",
      gender: "Masculino",
      initials: "CM"
    },
    {
      id: "PAT-5567",
      name: "Ana Sofía Torres",
      dni: "09876543",
      email: "a.torres@hotmail.com",
      phone: "+51 955 667 788",
      status: "ACTIVO",
      gender: "Femenino",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
            Gestión de Pacientes
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Directorio de Pacientes
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Administra los registros de pacientes, historiales médicos y datos de contacto.
          </p>
        </div>
        <button className="bg-[#2381a8] hover:bg-[#1f7396] text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Registrar Nuevo Paciente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#f0f9ff] dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-50 dark:border-blue-900/20 relative overflow-hidden">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Pacientes Registrados</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-bold text-zinc-900 dark:text-white">1,248</h3>
              <div className="bg-[#ccfbf1] text-[#0f766e] px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                +45 este mes
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Distribución Demográfica</h4>
            <div className="space-y-6">
              {[
                { label: "Mujeres", value: 52, color: "bg-pink-500" },
                { label: "Hombres", value: 45, color: "bg-blue-500" },
                { label: "Otros", value: 3, color: "bg-zinc-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">{item.label}</span>
                    <span className="text-zinc-900 dark:text-white font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-fit">
                <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2381a8] text-white shadow-sm">
                  Todos
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900">
                  Activos
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900">
                  Inactivos
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar paciente..." 
                    className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Paciente</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Documento (DNI)</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Contacto</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Estado</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {patients.map((pat, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            {pat.image ? (
                              <img src={pat.image} alt={pat.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-blue-600">{pat.initials}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{pat.name}</p>
                            <p className="text-[11px] font-bold text-zinc-400 mt-0.5 tracking-wide">{pat.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{pat.dni}</p>
                          <p className="text-[11px] font-bold text-zinc-400 tracking-wide">ID: {pat.id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{pat.email}</p>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{pat.phone}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${
                          pat.status === 'ACTIVO' 
                            ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-[#fff7ed] text-[#d97706] border-[#ffedd5] dark:bg-amber-900/20 dark:text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pat.status === 'ACTIVO' ? 'bg-[#059669]' : 'bg-[#d97706]'}`}></span>
                          {pat.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm font-medium text-zinc-400">
                Mostrando <span className="text-zinc-900 dark:text-white">1 a 4</span> de 1,248 registros
              </p>
              <div className="flex items-center gap-1">
                <button className="p-2 text-zinc-400 hover:text-zinc-900 disabled:opacity-50">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button 
                    key={page}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      page === 1 
                        ? 'bg-[#2381a8] text-white shadow-sm' 
                        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-zinc-400 font-bold">...</span>
                <button className="p-2 text-zinc-400 hover:text-zinc-900">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
