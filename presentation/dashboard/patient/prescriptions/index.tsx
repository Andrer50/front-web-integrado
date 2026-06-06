"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Printer, 
  Download, 
  Clock, 
  Pill, 
  Calendar, 
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  notes?: string;
  issueDate: string;
  items: PrescriptionItem[];
}

interface PrescriptionsProps {
  prescriptions: Prescription[];
}

// Recetas de demostración en caso de que el paciente no tenga registradas aún
const demoPrescriptions: Prescription[] = [
  {
    id: "demo-1",
    issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // hace 2 días
    notes: "Tomar abundante agua durante el tratamiento. Evitar el consumo de bebidas alcohólicas. Si presenta sarpullido, suspender inmediatamente.",
    items: [
      {
        id: "item-1-1",
        medicationName: "Amoxicilina 500mg (Cápsulas)",
        dosage: "1 cápsula",
        frequency: "Cada 8 horas",
        duration: "7 días",
        instructions: "Tomar después de los alimentos."
      },
      {
        id: "item-1-2",
        medicationName: "Paracetamol 500mg (Tabletas)",
        dosage: "1 tableta",
        frequency: "Cada 6 horas (solo si hay dolor o fiebre)",
        duration: "3 días",
        instructions: "No tomar con el estómago vacío."
      }
    ]
  },
  {
    id: "demo-2",
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // hace 30 días
    notes: "Control de presión arterial en 15 días. Mantener dieta baja en sodio y caminar 30 minutos al día.",
    items: [
      {
        id: "item-2-1",
        medicationName: "Losartán Potásico 50mg",
        dosage: "1 tableta",
        frequency: "Cada 24 horas (por las mañanas)",
        duration: "Permanente",
        instructions: "Tomar preferentemente a las 8:00 AM con un vaso de agua."
      }
    ]
  }
];

export function PatientPrescriptions({ prescriptions: apiPrescriptions }: PrescriptionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [useDemo, setUseDemo] = useState(apiPrescriptions.length === 0);

  const activePrescriptions = useDemo ? demoPrescriptions : apiPrescriptions;

  // Filtrado de recetas por nombre de medicamento o nota
  const filteredPrescriptions = activePrescriptions.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesNotes = p.notes?.toLowerCase().includes(query);
    const matchesMeds = p.items.some(
      (item) => item.medicationName.toLowerCase().includes(query)
    );
    return matchesNotes || matchesMeds;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePrint = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    // Disparar la impresión nativa después de un leve delay para que se renderice el iframe o modal si fuera necesario
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return { day, month, year };
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-950 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Buscar por medicamento o indicaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-5 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm focus-visible:ring-2 focus-visible:ring-celeste/20 focus-visible:border-celeste"
          />
        </div>
        
        {apiPrescriptions.length === 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Modo:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUseDemo(!useDemo);
                toast.info(useDemo ? "Mostrando recetas vacías de API" : "Mostrando recetas de demostración");
              }}
              className="rounded-xl font-bold border-zinc-200 text-xs px-3 h-8 hover:bg-zinc-50"
            >
              {useDemo ? "Ver Real (Vacío)" : "Ver Demo"}
            </Button>
          </div>
        )}
      </div>

      {/* Info Alert when using Demo Mode */}
      {useDemo && apiPrescriptions.length === 0 && (
        <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30 p-4 rounded-2xl text-amber-800 dark:text-amber-200 text-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Modo Demostración Activo:</span> Actualmente no cuentas con recetas registradas en tu historial clínico. Te mostramos recetas de ejemplo para que puedas previsualizar la interfaz.
          </div>
        </div>
      )}

      {/* Main List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 text-center p-6">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-petroleo dark:text-white">No se encontraron recetas</h3>
          <p className="text-zinc-400 text-sm mt-1 max-w-sm">
            {searchQuery ? "Intenta con otros términos de búsqueda." : "No tienes recetas médicas disponibles en este momento."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => {
            const isExpanded = expandedId === prescription.id;
            const { day, month, year } = formatShortDate(prescription.issueDate);
            
            return (
              <Card 
                key={prescription.id}
                className="overflow-hidden border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all rounded-[2rem] bg-white dark:bg-zinc-950"
              >
                <CardContent className="p-0">
                  {/* Card Header (Clickable to toggle expand) */}
                  <div 
                    onClick={() => toggleExpand(prescription.id)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Calendar Badge */}
                      <div className="w-14 h-14 bg-blanco-azulado dark:bg-zinc-900 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] font-bold text-celeste leading-none mt-1">{month}</span>
                        <span className="text-xl font-extrabold text-petroleo dark:text-white leading-none mt-0.5">{day}</span>
                        <span className="text-[9px] font-bold text-zinc-400 leading-none mt-1">{year}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-petroleo dark:text-white text-base">
                            Receta Médica
                          </h3>
                          <span className="text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            Activo
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Emitido el {formatDate(prescription.issueDate)}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 font-semibold">
                          {prescription.items.length} {prescription.items.length === 1 ? "medicamento recetado" : "medicamentos recetados"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(prescription);
                        }}
                        className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-petroleo h-10 w-10 cursor-pointer"
                        title="Imprimir receta"
                      >
                        <Printer className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(prescription.id);
                        }}
                        className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 h-10 w-10 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-zinc-100 dark:border-zinc-800 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      
                      {/* Medications List */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Detalle del Tratamiento
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {prescription.items.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100/50 dark:border-zinc-800/50 rounded-2xl p-4 flex gap-4 items-start"
                            >
                              <div className="w-10 h-10 bg-celeste/10 rounded-xl flex items-center justify-center shrink-0 text-celeste">
                                <Pill className="w-5 h-5" />
                              </div>
                              <div className="space-y-1.5 flex-1">
                                <h5 className="font-bold text-petroleo dark:text-white text-sm">
                                  {item.medicationName}
                                </h5>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs">
                                  <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                                    <span className="font-bold text-petroleo/80 dark:text-zinc-300">Dosis:</span> {item.dosage}
                                  </div>
                                  <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                                    <span className="font-bold text-petroleo/80 dark:text-zinc-300">Frecuencia:</span> {item.frequency}
                                  </div>
                                  <div className="text-zinc-600 dark:text-zinc-400 font-medium">
                                    <span className="font-bold text-petroleo/80 dark:text-zinc-300">Duración:</span> {item.duration}
                                  </div>
                                </div>

                                {item.instructions && (
                                  <div className="text-xs text-zinc-500 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-start gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-celeste shrink-0 mt-0.5" />
                                    <span>{item.instructions}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* General Indications / Notes */}
                      {prescription.notes && (
                        <div className="mt-5 bg-[#f5f8fc] dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <h4 className="text-xs font-bold text-petroleo dark:text-white uppercase tracking-wider mb-2">
                            Indicaciones Adicionales
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                            {prescription.notes}
                          </p>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="mt-5 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button
                          variant="outline"
                          onClick={() => handlePrint(prescription)}
                          className="rounded-xl font-bold text-xs border-zinc-200 h-10 px-5 hover:bg-zinc-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          Imprimir Receta
                        </Button>
                      </div>

                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Printable Area (Hidden in screen mode, visible only during print) */}
      {selectedPrescription && (
        <div id="print-prescription-card" className="hidden print:block p-10 space-y-8 bg-white text-black min-h-screen">
          {/* Print Header */}
          <div className="flex justify-between items-center border-b-2 border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900">MediConnect</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Excelencia Clínica y Acceso Seguro</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold text-zinc-800">RECETA MÉDICA</h2>
              <p className="text-xs text-zinc-500 font-medium">ID: {selectedPrescription.id}</p>
            </div>
          </div>

          {/* Date */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <span className="font-bold text-xs text-zinc-500 block uppercase">Fecha de Emisión</span>
            <span className="text-sm font-semibold text-zinc-800">{formatDate(selectedPrescription.issueDate)}</span>
          </div>

          {/* Treatment Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 pb-2">Tratamiento e Indicaciones</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-300">
                  <th className="py-2.5 font-bold">Medicamento</th>
                  <th className="py-2.5 font-bold">Dosis</th>
                  <th className="py-2.5 font-bold">Frecuencia</th>
                  <th className="py-2.5 font-bold">Duración</th>
                </tr>
              </thead>
              <tbody>
                {selectedPrescription.items.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-zinc-900">{item.medicationName}</div>
                      {item.instructions && <div className="text-[11px] text-zinc-500 mt-1 italic">{item.instructions}</div>}
                    </td>
                    <td className="py-3 font-medium text-zinc-700">{item.dosage}</td>
                    <td className="py-3 font-medium text-zinc-700">{item.frequency}</td>
                    <td className="py-3 font-medium text-zinc-700">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* General Notes */}
          {selectedPrescription.notes && (
            <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Indicaciones Generales</h3>
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                {selectedPrescription.notes}
              </p>
            </div>
          )}

          {/* Print Footer / Signatures */}
          <div className="pt-20 flex justify-between items-end">
            <div className="text-center w-[200px]">
              <div className="border-t border-zinc-400 pt-2 text-xs font-bold text-zinc-400">Firma del Médico</div>
            </div>
            <div className="text-center text-[10px] text-zinc-400 font-medium max-w-xs">
              Receta médica generada digitalmente a través de MediConnect.
              Para validación o consultas, comuníquese al área clínica.
            </div>
            <div className="text-center w-[200px]">
              <div className="border-t border-zinc-400 pt-2 text-xs font-bold text-zinc-400">Sello Clínico</div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles for Print Mode */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-prescription-card, #print-prescription-card * {
            visibility: visible;
          }
          #print-prescription-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
}
