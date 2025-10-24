import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { signIn } from "../services";
import { useNavigate } from "react-router";
import { useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";
import ErrorDialog from "./ErrorDialog";

export default function LoginForm({ openDrawer }: { openDrawer?: boolean }) {
  const inputFocusRef = useRef<HTMLInputElement | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const navigate = useNavigate();
  const fields = [
    { label: "Empresa", name: "company", type: "text" },
    { label: "Usuario", name: "username", type: "text" },
    { label: "Contraseña", name: "password", type: "password" },
  ];
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm();

  useEffect(() => {
    if (openDrawer) {
      setFocusIdx(0);
      setTimeout(() => {
        inputFocusRef.current?.focus();
      }, 300);
    }
  }, [openDrawer]);

  useEffect(() => {
    inputFocusRef.current?.focus();
  }, [focusIdx]);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (idx < fields.length - 1) {
        setFocusIdx(idx + 1);
      } else {
        (e.target as HTMLInputElement).form?.requestSubmit();
      }
    }
  }
  const { mutate } = useMutation({
    mutationFn: signIn,
    onError: (error: any) => {
      console.log(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Error de autenticación. Verifica tus datos e intenta nuevamente."
      );
      setErrorDialogOpen(true);
    },
    onSuccess: (data) => {
      if (!data) {
        setErrorMessage("No se recibió data en la respuesta de sign-in");
        setErrorDialogOpen(true);
        return;
      }
      Cookies.set("access_token", data.data.access_token);
      Cookies.set("refresh_token", data.data.refresh_token);
      navigate("/dashboard");
    },
  });

  function onSubmit(formData: any) {
    mutate(formData);
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <ErrorDialog
        open={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, idx) => {
          const { ref, ...rest } = register(field.name, { required: "Campo requerido" });
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-sm text-gray-300 font-medium">
                {field.label}
              </label>
              <input
                id={field.name}
                ref={(el) => {
                  ref(el);
                  if (idx === focusIdx) inputFocusRef.current = el;
                }}
                type={field.type}
                className={`py-1.5 px-1.5 rounded bg-[#23263a] text-white text-xs tracking-wider border focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    errors[field.name] && touchedFields[field.name]
                      ? "border-red-500"
                      : "border-[#2d3344]"
                  }`}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                {...rest}
              />
            </div>
          );
        })}
        <button
          type="submit"
          className={`mt-2 py-2 rounded font-semibold text-lg shadow transition
            ${
              watch("company") && watch("username") && watch("password")
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-default"
            }
          `}
          disabled={!(watch("company") && watch("username") && watch("password"))}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
