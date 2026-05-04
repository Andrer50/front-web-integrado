import { 
  Plus, 
  Filter, 
  MoreVertical, 
  TrendingUp,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

export default function AdminDoctorsPage() {
  const doctors = [
    {
      id: "DOC-4829",
      name: "Dra. Sarah Jenkins",
      specialty: "Cardiología",
      email: "s.jenkins@mediconn...",
      phone: "+1 (555) 123-4567",
      status: "ACTIVO",
      image: "https://images.unsplash.com/photo-1559839734-2b71f1e9cbee?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "DOC-3910",
      name: "Dr. Michael Chen",
      specialty: "Neurología",
      email: "m.chen@mediconne...",
      phone: "+1 (555) 987-6543",
      status: "ACTIVO",
      initials: "MC"
    },
    {
      id: "DOC-7742",
      name: "Dra. Emily Rossi",
      specialty: "Pediatría",
      email: "e.rossi@mediconnec...",
      phone: "+1 (555) 345-6789",
      status: "DE LICENCIA",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      id: "DOC-1102",
      name: "Dr. James Wilson",
      specialty: "Oncología",
      email: "j.wilson@mediconne...",
      phone: "+1 (555) 222-3333",
      status: "ACTIVO",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
            Gestión de Médicos
          </p>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Directorio del Personal Médico
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Administra los perfiles de los médicos, sus especialidades y asignaciones clínicas.
          </p>
        </div>
        <button className="bg-[#2381a8] hover:bg-[#1f7396] text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Agregar Nuevo Médico
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#f0f9ff] dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-50 dark:border-blue-900/20 relative overflow-hidden">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Médicos Activos</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-4xl font-bold text-zinc-900 dark:text-white">124</h3>
              <div className="bg-[#ccfbf1] text-[#0f766e] px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3" />
                +3 este mes
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Distribución por Especialidad</h4>
            <div className="space-y-6">
              {[
                { label: "Cardiología", value: 35, color: "bg-blue-500" },
                { label: "Neurología", value: 25, color: "bg-teal-500" },
                { label: "Pediatría", value: 20, color: "bg-indigo-500" },
              ].map((spec) => (
                <div key={spec.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">{spec.label}</span>
                    <span className="text-zinc-900 dark:text-white font-bold">{spec.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${spec.color} rounded-full`} 
                      style={{ width: `${spec.value}%` }}
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
                  Todos los Médicos
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900">
                  Disponibles
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900">
                  De Licencia
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 uppercase tracking-wider">
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Nombre del Médico</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Especialidad</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Información de Contacto</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400">Estado</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {doctors.map((doc, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            {doc.image ? (
                              <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-blue-600">{doc.initials}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{doc.name}</p>
                            <p className="text-[11px] font-bold text-zinc-400 mt-0.5 tracking-wide">ID: {doc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#1e40af] dark:bg-blue-900/30 dark:text-blue-300">
                          {doc.specialty}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{doc.email}</p>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{doc.phone}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${
                          doc.status === 'ACTIVO' 
                            ? 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5] dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb] dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.status === 'ACTIVO' ? 'bg-[#059669]' : 'bg-[#4b5563]'}`}></span>
                          {doc.status}
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
                Mostrando <span className="text-zinc-900 dark:text-white">1 a 4</span> de 124 registros
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
