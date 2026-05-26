import * as Yup from "yup";

export const specialtySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es obligatoria"),
  status: Yup.string().required("El estado es obligatorio"),
});
