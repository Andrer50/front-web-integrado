import { createPatientAction } from "@/core/user/patient/actions";
import { useMutation } from "@tanstack/react-query";

export const useCreatePatient = () => {
  const createPatientMutation = useMutation({
    mutationFn: createPatientAction,
  });

  return {
    createPatientMutation,
  };
};
