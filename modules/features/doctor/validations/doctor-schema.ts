import * as Yup from "yup";

export const doctorSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
  lastName: Yup.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .required("El teléfono es obligatorio"),
  medicalLicenseNumber: Yup.string()
    .required("El número de colegiatura es obligatorio"),
  bio: Yup.string()
    .min(20, "La biografía debe tener al menos 20 caracteres")
    .required("La biografía es obligatoria"),
  specialtyIds: Yup.array()
    .min(1, "Debe seleccionar al menos una especialidad")
    .required("Las especialidades son obligatorias"),
});
