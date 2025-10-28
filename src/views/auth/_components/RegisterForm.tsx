import { useForm } from "react-hook-form";
import { useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signUp } from "../services";

interface RegisterFormData {
  nombre: string;
  cuit: string;
  domicilio: string;
  provincia: string;
  localidad: string;
  cpostal: string;
  codarea: string;
  telefono: string;
  email: string;
  usuario: string;
  password: string;
  confirmar: string;
}

export default function RegisterForm() {
  // Para re-render en tiempo real del botón de enviar
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Cargar valores persistidos si existen
  const persistedStep1 = localStorage.getItem("registerFormStep1");
  const [provincias, setProvincias] = useState<{ id: string; nombre: string }[]>([]);
  const [focusIdx, setFocusIdx] = useState(0);
  const [step, setStep] = useState(1);
  // Creamos refs para todos los inputs y selects de Step 1
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const step2InputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);

  const { register, handleSubmit, getValues, watch, setValue } = useForm<RegisterFormData>({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: persistedStep1 ? JSON.parse(persistedStep1) : undefined,
  });
  const step2Values = watch(["usuario", "password", "confirmar"]);

  // console.log(getValues());

  // Persistir los datos del step 1 en localStorage cada vez que cambian
  useEffect(() => {
    const subscription = watch((values) => {
      // Solo guardamos los campos del step 1
      const step1Values: Record<string, any> = {};
      fieldsStep1.forEach((f) => {
        step1Values[f.name] = values[f.name];
      });
      localStorage.setItem("registerFormStep1", JSON.stringify(step1Values));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const fieldsStep1 = [
    {
      label: "Empresa",
      name: "nombre",
      type: "text",
      inputWidth: "w-64",
      maxLength: 40,
    },
    { label: "CUIT", name: "cuit", type: "text", inputWidth: "w-40", maxLength: 11 },
    {
      label: "Domicilio",
      name: "domicilio",
      type: "text",
      inputWidth: "w-64",
      maxLength: 35,
    },
    {
      label: "Provincia",
      name: "provincia",
      type: "text",
      inputWidth: "w-48",
    },
    {
      label: "Localidad",
      name: "localidad",
      type: "text",
      inputWidth: "w-48",
    },
    {
      label: "C. Postal",
      name: "cpostal",
      type: "text",
      inputWidth: "w-20",
      maxLength: 8,
    },
    {
      label: "Cod. Área",
      name: "codarea",
      type: "text",
      inputWidth: "w-20",
      maxLength: 5,
    },
    {
      label: "Teléfono",
      name: "telefono",
      type: "text",
      inputWidth: "w-40",
      maxLength: 10,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      inputWidth: "w-64",
      maxLength: 50,
    },
  ] as const;

  const fieldsStep2 = [
    { label: "Usuario", name: "usuario", type: "text", inputWidth: "w-40", maxLength: 20 },
    { label: "Contraseña", name: "password", type: "password", inputWidth: "w-40", maxLength: 20 },
    { label: "Confirmar", name: "confirmar", type: "password", inputWidth: "w-40", maxLength: 20 },
  ] as const;

  const { mutate } = useMutation({
    mutationFn: signUp,
    onError: (error: any) => {
      console.error("Error during sign-up:", error);
    },
    onSuccess: (data: any) => {
      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Ahora puedes iniciar sesión.",
        timer: 2000,
        showConfirmButton: false,
        background: "#23272f",
        color: "#fff",
        iconColor: "#60a5fa",
      });
      console.log(data);
    },
  });

  useEffect(() => {
    setFocusIdx(0);
    const storedProvincias = localStorage.getItem("provincias");
    if (storedProvincias) {
      setProvincias(JSON.parse(storedProvincias));
    } else {
      fetch("https://apis.datos.gob.ar/georef/api/provincias")
        .then((res) => res.json())
        .then((data) => {
          const lista = data.provincias.map((p: any) => ({ id: p.id, nombre: p.nombre }));
          setProvincias(lista);
          localStorage.setItem("provincias", JSON.stringify(lista));
        });
    }
  }, []);

  useEffect(() => {
    // Solo para Step 1: enfocar el input correspondiente al focusIdx
    if (step === 1) {
      const field = fieldsStep1[focusIdx];
      if (field.name === "provincia") {
        selectRefs.current[focusIdx]?.focus();
      } else {
        inputRefs.current[focusIdx]?.focus();
      }
    }
    // Al pasar al step 2, enfocar el input de usuario
    if (step === 2 && step2InputRefs.current[0]) {
      step2InputRefs.current[0].focus();
    }
  }, [focusIdx, step]);

  useEffect(() => {
    if (step === 1 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusIdx(0);
    }
  }, [step]);

  function getStep1Valid() {
    const values = getValues();
    return fieldsStep1.every((f) => {
      const v = values[f.name as keyof RegisterFormData];
      return typeof v === "string" ? v.trim() !== "" : !!v;
    });
  }

  // function getStep2Valid() {
  //   const vals = getValues();
  //   return fieldsStep2.every((f) => {
  //     const v = vals[f.name as keyof RegisterFormData] ?? "";
  //     return typeof v === "string" ? v.trim() !== "" : !!v;
  //   });
  // }

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 1) {
        if (idx < fieldsStep1.length - 1) {
          setFocusIdx(idx + 1);
        } else {
          // Si todos los campos están llenos, pasar al step 2
          if (getStep1Valid()) {
            setStep(2);
          }
        }
      } else if (step === 2) {
        // Step 2: usuario, password, confirmar
        if (idx < fieldsStep2.length - 1) {
          const nextInput = step2InputRefs.current[idx + 1];
          nextInput?.focus();
        } else {
          (e.target as HTMLInputElement).form?.requestSubmit();
        }
      }
    }
  }

  function onSubmit(data: any) {
    // Validar contraseñas iguales
    // console.log(data);

    if (data.password !== data.confirmar) {
      setPasswordError("Las contraseñas deben ser idénticas.");
      return;
    }
    setPasswordError("");
    mutate(data);
  }

  return (
    <form className="flex flex-col gap-4 w-full min-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl text-center font-bold text-blue-400 mb-1">
        {step === 1 ? "Registro de Empresa" : "Datos de Usuario"}
      </h2>
      <p className="text-gray-300 text-sm text-center mb-4">
        {step === 1
          ? "Completa los datos de la empresa y contacto principal."
          : "Crea el usuario para acceder al sistema."}
      </p>

      {(step === 1 ? fieldsStep1 : fieldsStep2).map((field, idx) => {
        if (!field) return null;
        let validation: any = { required: "Campo requerido" };
        if ("maxLength" in field && field.maxLength) {
          validation.maxLength = {
            value: field.maxLength,
            message: `Máximo ${field.maxLength} caracteres`,
          };
        }
        if (["cuit", "codarea", "telefono", "cpostal"].includes(field.name)) {
          validation.pattern = { value: /^[0-9]+$/, message: "Solo números" };
        }
        if (field.name === "email") {
          validation.pattern = {
            value: /^[^\s@]+@[^0-]+\.[^\s@]+$/,
            message: "Email inválido",
          };
        }
        // Cast field.name to keyof RegisterFormData for type safety
        const { ref, ...rest } = register(field.name as keyof RegisterFormData, validation);

        // Asignar refs para focus
        if (step === 1) {
          if (field.name === "provincia") {
            selectRefs.current[idx] = selectRefs.current[idx] || null;
          } else {
            inputRefs.current[idx] = inputRefs.current[idx] || null;
          }
        }
        if (step === 2) {
          step2InputRefs.current[idx] = null;
        }

        // Inputs de password y confirmar con icono de ojo
        if (step === 2 && (field.name === "password" || field.name === "confirmar")) {
          const show = field.name === "password" ? showPassword : showConfirm;
          const setShow = field.name === "password" ? setShowPassword : setShowConfirm;
          return (
            <div key={field.name} className="flex items-center gap-4 ">
              <label
                htmlFor={field.name}
                className={`w-32 text-right text-sm text-gray-300 font-medium tracking-wide`}
              >
                {field.label}
              </label>
              <div className="relative" style={{ width: field.inputWidth }}>
                <input
                  id={field.name}
                  ref={(el) => {
                    ref(el);
                    step2InputRefs.current[idx] = el;
                  }}
                  type={show ? "text" : "password"}
                  className={`text-xs py-1 px-1.5 pr-8 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 w-full`}
                  maxLength={"maxLength" in field ? field.maxLength : undefined}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  {...rest}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-blue-400 focus:outline-none"
                  style={{ pointerEvents: "auto" }}
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          );
        }

        // ...inputs normales...
        return (
          <div key={field.name} className="flex items-center gap-4">
            <label
              htmlFor={field.name}
              className={`${
                step === 2 ? "w-32" : "w-20"
              } text-right text-sm text-gray-300 font-medium tracking-wide`}
            >
              {field.label}
            </label>
            {field.name === "provincia" ? (
              <select
                id={field.name}
                ref={(el) => {
                  ref(el);
                  if (step === 1) selectRefs.current[idx] = el;
                }}
                className={`text-xs py-1 px-1.5 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 ${field.inputWidth}`}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onChange={(e) => {
                  const nombre = provincias.find((p) => p.id === e.target.value)?.nombre || "";
                  setValue("provincia", nombre);
                }}
                value={(() => {
                  const nombreActual = getValues().provincia || "";
                  const provinciaActual = provincias.find((p) => p.nombre === nombreActual);
                  return provinciaActual?.id || "";
                })()}
              >
                <option value=""></option>
                {provincias.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                ref={(el) => {
                  ref(el);
                  if (step === 1) inputRefs.current[idx] = el;
                  if (step === 2) step2InputRefs.current[idx] = el;
                }}
                type={field.type}
                className={`text-xs py-1 px-1.5 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 ${field.inputWidth}`}
                maxLength={"maxLength" in field ? field.maxLength : undefined}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                {...rest}
              />
            )}
          </div>
        );
      })}

      {/* Mensaje de error de contraseñas */}
      {step === 2 && passwordError && (
        <div className="text-red-500 text-xs font-semibold text-center mb-2">{passwordError}</div>
      )}

      <div className="flex gap-2 justify-end">
        {step === 2 && (
          <button
            type="button"
            className="px-4 py-2 rounded font-semibold text-sm shadow bg-gray-600 text-white hover:bg-gray-700 cursor-pointer transition"
            onClick={() => setStep(1)}
          >
            Volver
          </button>
        )}
        <button
          type={step === 1 ? "button" : "submit"}
          className={`px-4 py-2 rounded font-semibold text-sm shadow
            ${
              (
                step === 1
                  ? getStep1Valid()
                  : Object.values(step2Values).every((v) =>
                      typeof v === "string" ? v.trim() !== "" : !!v
                    )
              )
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }
          `}
          onClick={step === 1 ? () => setStep(2) : undefined}
          disabled={
            step === 1
              ? !getStep1Valid()
              : !Object.values(step2Values).every((v) =>
                  typeof v === "string" ? v.trim() !== "" : !!v
                )
          }
        >
          {step === 1 ? "Siguiente" : "Registrar"}
        </button>
      </div>
    </form>
  );
}
