import * as Yup from "yup";

export const patientValidationSchema = Yup.object({
  firstName: Yup.string().required("Requerido"),
  lastName: Yup.string().required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Requerido"),
  documentNumber: Yup.string()
    .length(8, "DNI debe tener 8 dígitos")
    .required("Requerido"),
  phone: Yup.string().required("Requerido"),
  birthDate: Yup.string().required("Requerido"),
  gender: Yup.string().required("Requerido"),
  address: Yup.string().optional(),
});
