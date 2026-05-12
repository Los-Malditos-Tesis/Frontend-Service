import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { updateUser, registerUser } from "../../services/api";
import { userSchema } from "../../validations/UserSchema";
import registerSchema from "../../validations/RegisterSchema";
import { useAuth } from "../../context/AuthContext";

const UserForm = ({ selectedUser, onSuccess }) => {
  const { user: currentUser } = useAuth();

  // Edit form
  const editForm = useForm({
    resolver: zodResolver(userSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isSubmittingEdit },
  } = editForm;

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isSubmittingCreate },
  } = registerForm;

  useEffect(() => {
    if (selectedUser) {
      setValueEdit("id", selectedUser.id);
      setValueEdit("name", selectedUser.name);
      setValueEdit("email", selectedUser.email);
      setValueEdit("status", String(Boolean(selectedUser.status)));
    } else {
      resetEdit();
    }
  }, [selectedUser, setValueEdit, resetEdit]);

  const onUpdate = async (data) => {
    try {
      await updateUser(selectedUser.id, {
        id: selectedUser.id,
        name: data.name,
        email: data.email,
        status: data.status === "true",
      });
      toast.success("Usuario actualizado");
      onSuccess();
      resetEdit();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
    }
  };

  const onCreate = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        roles: data.role ? [{ id: data.role, name: data.role }] : [{ id: "USER", name: "Operative" }],
      };

      const result = await registerUser(payload);

      if (result.success) {
        toast.success("Usuario creado");
        onSuccess();
        resetCreate();
      } else {
        throw new Error(result.error || "Error creando usuario");
      }
    } catch (err) {
      toast.error(err?.message || "Error en la operación");
    }
  };

  // If selectedUser is null -> render registration form
  if (!selectedUser)
    return (
      <form onSubmit={handleSubmitCreate(onCreate)} className="w-full flex flex-col gap-4">
        <CustomInput labelText="Nombre"
          {...registerCreate("name")}
          errors={createErrors.name} />

        <CustomInput labelText="Email"
          {...registerCreate("email")}
          errors={createErrors.email} />

        <CustomInput
          labelText="Password"
          type="password" {...registerCreate("password")}
          errors={createErrors.password} />

        <CustomInput
          labelText="Confirmar Password"
          type="password"
          {...registerCreate("confirmPassword")}
          errors={createErrors.confirmPassword} />

        {/* Rol se asigna por defecto en backend; no pedir al usuario en creación */}

        <div className="md:col-span-2 mt-6">
          <CustomButton type="submit" loading={isSubmittingCreate}>
            Crear Usuario
          </CustomButton>
        </div>
      </form>
    );

  // Edit form UI
  const isEditingSelf = currentUser && selectedUser && String(currentUser.id) === String(selectedUser.id);

  return (
    <form onSubmit={handleSubmitEdit(onUpdate)} className="w-full flex flex-col gap-4">
      <input type="hidden" {...registerEdit("id")} />

      {isEditingSelf && (
        <p className="text-sm text-yellow-700">Estás editando tu propio usuario; no puedes cambiar tu estado desde aquí.</p>
      )}

      <CustomInput labelText="Nombre" {...registerEdit("name")} errors={editErrors.name} />

      <CustomInput labelText="Email" {...registerEdit("email")} errors={editErrors.email} />

      {/* El estado se maneja desde la tabla (/status/:id). No exponer aquí. */}

      <div className="md:col-span-2 mt-6">
        <CustomButton type="submit" loading={isSubmittingEdit}>
          Actualizar Usuario
        </CustomButton>
      </div>
    </form>
  );
};

export default UserForm;