import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { signIn } from "./services";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

export default function LoginCard() {
  const navigate = useNavigate();
  const fields = [
    { label: "Empresa", name: "company", type: "text" },
    { label: "Usuario", name: "username", type: "text" },
    { label: "Contraseña", name: "password", type: "password" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate } = useMutation({
    mutationFn: signIn,
    onError: (error) => {
      console.error("Error during sign-in:", error);
    },
    onSuccess: (data) => {
      if (!data) {
        console.error("No se recibió data en la respuesta de sign-in");
        return;
      }

      Cookies.set("access_token", data.data.access_token);
      Cookies.set("refresh_token", data.data.refresh_token);

      navigate("/inicio");
    },
  });

  function onSubmit(formData: any) {
    mutate(formData);
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={field.name} className="text-sm text-gray-300 font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              {...register(field.name, { required: "Campo requerido" })}
              className="py-1.5 px-1.5 rounded bg-[#23263a] text-white text-xs tracking-wider border border-[#2d3344] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field.name] && (
              <span className="text-xs text-red-400 mt-1">
                {String(errors[field.name]?.message)}
              </span>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="mt-2 py-2 rounded bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
