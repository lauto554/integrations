import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { obtieneDatosAppMp } from "../services";

export default function IntegrarModal() {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const { mutate } = useMutation({
    mutationFn: obtieneDatosAppMp,
    onError: (error) => {
      setPending(false);
      console.log("Error obteniendo datos de la app de Mercado Pago:", error);
    },
    onSuccess: (data) => {
      console.log(data);
      if (!data || !data.data) {
        console.log("No se recibieron datos de la app de Mercado Pago");
        return;
      }
      const clientId = data.data.client_id;
      const redirectUri = data.data.redirect_uri;
      const state = Math.random().toString(36).substring(2, 15);
      const authUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
      const width = 500;
      const height = window.screen.height;
      const left = window.screen.width - width;
      const top = 0;
      const win = window.open(
        authUrl,
        "mp_auth",
        `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
      );
      if (win) {
        win.focus();
        popupRef.current = win;
        setPending(true);
        // Polling para detectar cierre de la ventana
        const timer = setInterval(() => {
          if (win.closed) {
            setPending(false);
            clearInterval(timer);
          }
        }, 500);
      } else {
        setPending(false);
      }
    },
  });

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.mp_code) {
        // Aquí recibes el code de Mercado Pago
        console.log("Código recibido:", event.data.mp_code);
        setPending(false);
        if (popupRef.current) popupRef.current.close();
        // Aquí puedes continuar el flujo (ej: mostrar éxito, avanzar de paso, etc)
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleConfirmar() {
    if (!pending) mutate();
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-xl w-full mx-auto">
      {step === 1 && (
        <>
          <h2 className="text-lg font-bold text-blue-400 mb-2">Términos y Condiciones</h2>
          <div
            className="bg-[#23262F] border border-[#2d3344] rounded p-4 text-gray-300 text-sm max-h-72 overflow-y-auto w-full"
            style={{ lineHeight: 1.7 }}
          >
            <h3 className="text-base font-semibold text-blue-300 mb-2">1. Introducción</h3>
            <p className="mb-3">
              Bienvenido a la integración de Mercado Pago. Al utilizar este servicio, aceptas los
              siguientes términos y condiciones. Por favor, léelos detenidamente antes de continuar.
            </p>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">2. Uso del Servicio</h4>
            <ul className="list-disc pl-5 mb-3">
              <li>Debes ser mayor de edad para utilizar la integración.</li>
              <li>La información proporcionada debe ser verídica y actualizada.</li>
              <li>No está permitido el uso fraudulento o ilegal del sistema.</li>
            </ul>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">
              3. Responsabilidades del Usuario
            </h4>
            <ul className="list-disc pl-5 mb-3">
              <li>El usuario es responsable de la seguridad de sus credenciales.</li>
              <li>Debe notificar cualquier uso no autorizado de su cuenta.</li>
              <li>Es su responsabilidad mantener la confidencialidad de la información.</li>
            </ul>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">4. Limitaciones</h4>
            <ul className="list-disc pl-5 mb-3">
              <li>El servicio puede estar sujeto a interrupciones por mantenimiento.</li>
              <li>No garantizamos disponibilidad ininterrumpida.</li>
              <li>Mercado Pago no se responsabiliza por pérdidas indirectas.</li>
            </ul>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">5. Privacidad</h4>
            <p className="mb-3">
              Tus datos serán tratados conforme a la política de privacidad de la empresa. No
              compartiremos tu información con terceros sin tu consentimiento, salvo requerimiento
              legal.
            </p>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">6. Modificaciones</h4>
            <ul className="list-disc pl-5 mb-3">
              <li>Nos reservamos el derecho de modificar estos términos en cualquier momento.</li>
              <li>Las modificaciones serán notificadas a través de la plataforma.</li>
            </ul>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">7. Aceptación</h4>
            <p className="mb-3">
              Al continuar, declaras haber leído y aceptado estos términos y condiciones en su
              totalidad.
            </p>
            <h4 className="font-semibold text-blue-200 mb-1 mt-3">8. Contacto</h4>
            <p>Para cualquier consulta, puedes contactarnos a soporte@demo.com.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="acepto"
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
            <label htmlFor="acepto" className="text-gray-200 text-sm select-none">
              Acepto Términos y Condiciones
            </label>
          </div>
          <button
            className={`mt-2 py-2 rounded font-semibold text-sm shadow transition w-full
              ${
                checked
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }
            `}
            disabled={!checked}
            onClick={() => setStep(2)}
          >
            Siguiente
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="text-lg font-bold text-blue-400 mb-2">
            Autorizar aplicación en Mercado Pago
          </h2>
          <div className="bg-[#23262F] border border-[#2d3344] rounded p-4 text-gray-300 text-sm">
            <p className="mb-3">
              A continuación se te redirigirá a la plataforma de Mercado Pago, donde deberás iniciar
              sesión y autorizar a nuestra app para operar en tu cuenta.
            </p>
            <p className="mb-3">Esta autorización es necesaria para que podamos:</p>
            <ul className="list-disc pl-5 mb-3">
              <li>Obtener información de tu negocio y perfil de cuenta.</li>
              <li>Crear órdenes de pago y gestionar cobros.</li>
              <li>Consultar pagos recibidos y su estado.</li>
              <li>Administrar sucursales, cajas y puntos de venta.</li>
              <li>Visualizar movimientos y reportes de tu actividad.</li>
              <li>Brindarte soporte y automatización en la gestión de tus operaciones.</li>
            </ul>
            <p className="mb-2">
              Podrás revocar este permiso en cualquier momento desde tu cuenta de Mercado Pago.
            </p>
            <p className="mb-2">
              Además, podrás eliminar la integración y todos los datos sensibles almacenados en
              nuestra base de datos en cualquier momento, con total transparencia. Si tienes dudas o
              necesitás ayuda, no dudes en contactar a nuestro equipo de soporte.
            </p>
          </div>
          <button
            className={`mt-2 py-2 rounded font-semibold text-sm shadow transition w-full
              ${
                pending
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }
            `}
            disabled={pending}
            onClick={handleConfirmar}
          >
            {pending ? "Esperando autorización..." : "Continuar"}
          </button>
        </>
      )}
    </div>
  );
}
