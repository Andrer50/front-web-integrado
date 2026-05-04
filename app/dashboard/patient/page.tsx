"use client";

import { 
  Calendar, 
  ShieldPlus, 
  History, 
  Wallet, 
  ChevronRight, 
  HeartPulse,
  Baby
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PatientDashboardPage() {
  const quickActions = [
    { title: "Reservar cita", icon: Calendar, color: "bg-blanco-azulado text-celeste" },
    { title: "Ver mis programas", icon: ShieldPlus, color: "bg-blanco-azulado text-verde-salud" },
    { title: "Ver historial de citas", icon: History, color: "bg-blanco-azulado text-tiffany" },
    { title: "Pagar mi cita", icon: Wallet, color: "bg-blanco-azulado text-celeste" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header & Quick Actions */}
      <section className="space-y-6">
        <h1 className="text-3xl font-black text-petroleo dark:text-white px-2 tracking-tight">¿Qué quieres hacer hoy?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, i) => (
            <Card key={i} className="group cursor-pointer hover:shadow-md transition-all rounded-[2rem] border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-petroleo dark:text-blue-400">{action.title}</span>
              </CardContent>
            </Card>
          ))}
          
          {/* Banner Card */}
          <Card className="lg:col-span-1 bg-celeste rounded-[2rem] overflow-hidden relative group min-h-[160px] border-none shadow-none">
            <CardContent className="p-6 relative z-10 text-white space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Gratuito para tu acompañante</p>
              <ul className="text-[10px] font-bold space-y-1">
                <li>• IMC</li>
                <li>• Medición de presión</li>
                <li>• Talla y peso</li>
              </ul>
              <img 
                src="/medical_banner_nurse.png" 
                alt="Promoción" 
                className="absolute right-0 bottom-0 w-24 h-24 object-contain translate-y-2 group-hover:scale-110 transition-transform" 
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Next Appointments */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-petroleo dark:text-white">Tus próximas citas</h2>
          <Button variant="link" className="text-sm font-bold text-celeste dark:text-blue-400 flex items-center gap-1 p-0 h-auto">
            Ver todas las citas <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <Card className="py-16 rounded-[2rem] border-dashed border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardContent className="flex flex-col items-center justify-center text-center p-0">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-zinc-300" />
            </div>
            <p className="text-petroleo/50 dark:text-zinc-400 font-bold tracking-tight">No tienes citas pendientes</p>
          </CardContent>
        </Card>
      </section>

      {/* Programs Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-petroleo dark:text-white px-2">Te ofrecemos los siguientes programas:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Program 1 */}
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-blanco-azulado rounded-[2rem] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                <HeartPulse className="w-12 h-12 text-celeste" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-petroleo dark:text-white">Programa Viva +</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Un programa pre-pago que cubre parte de los gastos de consultas y urgencias.
                </p>
                <div className="pt-2 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Desde</span>
                    <span className="text-2xl font-semibold text-verde-salud dark:text-blue-400">S/ 31.5</span>
                  </div>
                  <Button variant="celeste" size="sm" className="rounded-xl font-bold">Inscribirme</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program 2 */}
          <Card className="rounded-[2.5rem] border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-blanco-azulado rounded-[2rem] flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                <Baby className="w-12 h-12 text-verde-salud" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-bold text-petroleo dark:text-white">Programa de maternidad</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Un programa integral que te cuida antes, durante y después del embarazo.
                </p>
                <div className="pt-2 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Desde</span>
                    <span className="text-2xl font-semibold text-verde-salud dark:text-blue-400">S/ 120.0</span>
                  </div>
                  <Button variant="celeste" size="sm" className="rounded-xl font-bold">Inscribirme</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
