"use client";

import { MapPin, Clock, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AvailableDoctorSlotsResponse } from "@/core/appointment/interfaces";

interface DoctorSlotCardProps {
  doctor: AvailableDoctorSlotsResponse;
  selectedDateStr: string;
  selectedSlotId?: string;
  className?: string;
  onDaySelect: (doctorId: string, date: string) => void;
  onSlotClick: (
    doctorId: string,
    dateStr: string,
    timeStr: string,
    slotId: string,
  ) => void;
}

function getInitials(name: string): string {
  return name
    .replace(/Dr\./g, "")
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DoctorSlotCard({
  doctor,
  selectedDateStr,
  selectedSlotId,
  className,
  onDaySelect,
  onSlotClick,
}: DoctorSlotCardProps) {
  const activeDaySchedule = doctor.availableDates?.find(
    (d) => d.date === selectedDateStr,
  );
  const initials = getInitials(doctor.doctorName) || "ME";

  return (
    <Card className={`rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 overflow-hidden shadow-md flex flex-col xl:flex-row gap-8 items-start relative group hover:border-celeste/30 transition-all duration-300 ${className ?? ""}`}>
      <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-[40%]">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-celeste/20 to-blue-50 dark:to-zinc-900/40 flex items-center justify-center text-celeste font-bold text-3xl shadow-inner shrink-0 border border-celeste/10 relative">
          {initials}
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-extrabold text-celeste uppercase tracking-widest">
            {doctor.specialty}
          </p>
          <h3 className="text-xl font-black text-petroleo dark:text-white leading-snug group-hover:text-celeste transition-colors">
            {doctor.doctorName}
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
            CMP {doctor.cmp || "82144"}
          </p>
          <div className="inline-flex px-3 py-1.5 rounded-xl bg-celeste/10 text-celeste text-xs font-black uppercase tracking-wider">
            {doctor.modality || "Presencial"}
          </div>
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 space-y-1.5">
            <p className="text-xs font-black text-petroleo dark:text-zinc-300">
              Sede {doctor.branchName}
            </p>
            <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-celeste shrink-0" />
              {doctor.branchAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full space-y-6">
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-celeste" />
            Selecciona el día de tu consulta:
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {doctor.availableDates?.map((day) => {
              const isSelected = selectedDateStr === day.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => onDaySelect(doctor.doctorId, day.date)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl min-w-[85px] border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-celeste text-white border-celeste shadow-md shadow-blue-200/20"
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold ${isSelected ? "text-white/80" : "text-zinc-400"}`}
                  >
                    {day.dayLabel}
                  </span>
                  <span className="text-sm font-black mt-1">
                    {day.dateLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
            Horas disponibles para el día elegido:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {activeDaySchedule?.slots.map((slot) => (
              <button
                key={slot.slotId}
                type="button"
                onClick={() =>
                  onSlotClick(
                    doctor.doctorId,
                    selectedDateStr,
                    slot.time,
                    slot.slotId,
                  )
                }
                className={`py-3 px-4 rounded-xl border text-xs font-black text-center transition-all shadow-sm cursor-pointer ${
                  selectedSlotId === slot.slotId
                    ? "bg-celeste text-white border-celeste shadow-md shadow-blue-200/20"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-celeste hover:bg-celeste/5 text-zinc-700 dark:text-zinc-300 hover:text-celeste"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}