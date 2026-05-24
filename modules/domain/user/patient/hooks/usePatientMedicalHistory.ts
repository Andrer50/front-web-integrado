import { useQuery } from "@tanstack/react-query";
import { getPatientMedicalHistoryAction } from "@/core/user/patient/actions";

export const usePatientMedicalHistory = (patientId: string) => {
  return useQuery({
    queryKey: ["patient-medical-history", patientId],
    queryFn: () => getPatientMedicalHistoryAction(patientId),
    enabled: !!patientId,
  });
};
