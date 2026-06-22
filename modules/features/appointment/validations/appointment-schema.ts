import * as Yup from "yup";

export const appointmentValidationSchema = (isAdmin: boolean) =>
  Yup.object({
    reason: Yup.string()
      .min(5, "Describe brevemente el motivo (mínimo 5 caracteres)")
      .required("El motivo de la consulta es obligatorio"),
    patientId: isAdmin
      ? Yup.string().required("Debes seleccionar un paciente")
      : Yup.string().optional(),
  });