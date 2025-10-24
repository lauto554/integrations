import { useForm } from "react-hook-form";
import { useRef, useEffect, useState } from "react";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fields = [
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
  ];

  // Un solo ref para input y otro para select, y un índice de foco
  const inputFocusRef = useRef<HTMLInputElement | null>(null);
  const selectFocusRef = useRef<HTMLSelectElement | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);

  // Al montar, enfocar el primero
  useEffect(() => {
    setFocusIdx(0);
  }, []);

  // Enfocar el campo correspondiente cuando cambia focusIdx
  useEffect(() => {
    // Determinar si el campo enfocado es select o input
    const field = fields[focusIdx];
    if (["provincia", "localidad"].includes(field.name)) {
      selectFocusRef.current?.focus();
    } else {
      inputFocusRef.current?.focus();
    }
  }, [focusIdx]);

  // Manejar Enter para pasar al siguiente campo
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

  function onSubmit(data: any) {
    // Aquí puedes manejar el envío de datos
    console.log(data);
  }

  return (
    <form className="flex flex-col gap-4 w-full min-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl text-center font-bold text-blue-400 mb-1">Registro de Empresa</h2>
      <p className="text-gray-300 text-sm mb-4">
        Completa los datos para el registro de la empresa.
      </p>
      {fields.map((field, idx) => {
        // Validaciones específicas para react-hook-form
        let validation: any = { required: "Campo requerido" };
        if (field.maxLength) {
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
        // Usar solo un ref: separar el ref de register
        const { ref, ...rest } = register(field.name, validation);
        return (
          <div key={field.name} className="flex items-center gap-4">
            <label
              htmlFor={field.name}
              className="w-20 text-right text-sm text-gray-300 font-medium tracking-wide"
            >
              {field.label}
            </label>
            {field.name === "provincia" ? (
              <select
                id={field.name}
                ref={idx === focusIdx ? selectFocusRef : ref}
                className={`text-xs py-1 px-1.5 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 ${field.inputWidth}`}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                {...rest}
              >
                <option value="">Selecciona provincia</option>
                <option value="cordoba">Córdoba</option>
                <option value="buenosaires">Buenos Aires</option>
                <option value="santafe">Santa Fe</option>
              </select>
            ) : field.name === "localidad" ? (
              <select
                id={field.name}
                ref={idx === focusIdx ? selectFocusRef : ref}
                className={`text-xs py-1 px-1.5 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 ${field.inputWidth}`}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                {...rest}
              >
                <option value="">Selecciona localidad</option>
                <option value="caba">CABA</option>
                <option value="rosario">Rosario</option>
              </select>
            ) : (
              <input
                id={field.name}
                ref={idx === focusIdx ? inputFocusRef : ref}
                type={field.type}
                className={`text-xs py-1 px-1.5 rounded border border-[#2d3344] bg-[#181a20] text-white focus:outline-none focus:ring-2 tracking-widest focus:ring-blue-500 ${field.inputWidth}`}
                inputMode={
                  ["cuit", "codarea", "telefono", "cpostal"].includes(field.name)
                    ? "numeric"
                    : undefined
                }
                pattern={
                  ["cuit", "codarea", "telefono", "cpostal"].includes(field.name)
                    ? "[0-9]*"
                    : undefined
                }
                maxLength={field.maxLength}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                {...rest}
              />
            )}
            {errors[field.name]?.message && (
              <span className="ml-2 text-xs text-red-400">
                {String(errors[field.name]?.message)}
              </span>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition self-end"
      >
        Enviar
      </button>
    </form>
  );
}
