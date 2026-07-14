"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BranchResponse } from "@/core/branch/interfaces";
import type { SpecialtyResponse } from "@/core/specialty/interfaces";

interface ReservationFiltersProps {
  branches: BranchResponse[];
  specialties: SpecialtyResponse[];
  selectedSedeId: string;
  selectedSpecialtyId: string;
  onSedeChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onSearch: () => void;
}

export function ReservationFilters({
  branches,
  specialties,
  selectedSedeId,
  selectedSpecialtyId,
  onSedeChange,
  onSpecialtyChange,
  onSearch,
}: ReservationFiltersProps) {
  return (
    <Card className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-xl shadow-blue-100/10 bg-white dark:bg-zinc-950 p-8 overflow-hidden">
      <CardContent className="p-0 flex flex-col lg:flex-row items-end gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
          <div className="space-y-3">
            <Label className="font-bold text-petroleo dark:text-zinc-200">
              Sede
            </Label>
            <Select value={selectedSedeId} onValueChange={onSedeChange}>
              <SelectTrigger className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 font-semibold text-zinc-700 dark:text-zinc-300">
                <SelectValue placeholder="Selecciona una sede (Opcional)..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                <SelectItem value="all" className="rounded-xl cursor-pointer">
                  Todas las sedes
                </SelectItem>
                {branches.map((sede) => (
                  <SelectItem
                    key={sede.id}
                    value={sede.id}
                    className="rounded-xl cursor-pointer"
                  >
                    {sede.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="font-bold text-petroleo dark:text-zinc-200">
              Especialidad
            </Label>
            <Select
              value={selectedSpecialtyId}
              onValueChange={onSpecialtyChange}
            >
              <SelectTrigger className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 font-semibold text-zinc-700 dark:text-zinc-300">
                <SelectValue placeholder="Selecciona especialidad..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300">
                {specialties.map((spec) => (
                  <SelectItem
                    key={spec.id}
                    value={spec.id}
                    className="rounded-xl cursor-pointer"
                  >
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={onSearch}
          disabled={!selectedSpecialtyId}
          variant="celeste"
          className="h-14 px-8 rounded-2xl font-black w-full lg:w-fit cursor-pointer shadow-lg shadow-blue-200/20 dark:shadow-none hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Search className="w-5 h-5" />
          Reservar cita
        </Button>
      </CardContent>
    </Card>
  );
}