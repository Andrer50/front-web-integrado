import * as Yup from "yup";

export const appointmentSchema = Yup.object().shape({
  doctorId: Yup.string().required("El médico es obligatorio"),
  appointmentDate: Yup.string()
    .required("La fecha es obligatoria")
    .test("future-date", "La fecha de la cita debe ser futura", (value) => {
      if (!value) return false;
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }),
  appointmentTime: Yup.string().required("La hora es obligatoria"),
  reason: Yup.string()
    .min(5, "El motivo debe tener al menos 5 caracteres")
    .required("El motivo de consulta es obligatorio"),
});
