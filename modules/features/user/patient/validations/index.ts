import * as Yup from "yup";

export const patientValidationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .required("Requerido"),
  lastName: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .required("Requerido"),
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Requerido"),
  documentNumber: Yup.string()
    .matches(/^[0-9]{8}$/, "DNI debe tener 8 dígitos")
    .required("Requerido"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .length(9, "El teléfono debe tener 9 dígitos")
    .required("Requerido"),
  birthDate: Yup.string().required("Requerido"),
  gender: Yup.string().required("Requerido"),
  address: Yup.string().optional(),
});

export const patientUpdateValidationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .required("Requerido"),
  lastName: Yup.string()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo se permiten letras")
    .required("Requerido"),
  documentNumber: Yup.string()
    .matches(/^[0-9]{8}$/, "DNI debe tener 8 dígitos")
    .required("Requerido"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .length(9, "El teléfono debe tener 9 dígitos")
    .required("Requerido"),
  birthDate: Yup.string().required("Requerido"),
  gender: Yup.string().required("Requerido"),
  address: Yup.string().optional(),
});