import { FlaskConical } from "lucide-react";
import { LabOrdersView } from "@/components/lab/lab-orders-view";

export default function AdminLabResultsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <header className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-celeste">
          <FlaskConical className="h-4 w-4" /> Administración clínica
        </p>
        <h1 className="text-3xl font-black text-petroleo dark:text-white">Órdenes y resultados</h1>
        <p className="mt-2 text-sm font-medium text-zinc-500">Supervisa las solicitudes de laboratorio e imagen registradas para todos los pacientes.</p>
      </header>
      <LabOrdersView showPatient />
    </div>
  );
}
