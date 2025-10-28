import { useState, useEffect } from "react";
import { consultaMercado, obtieneDatosUserMp } from "./services";
import { useLocation } from "react-router-dom";
import { useMercadoStore } from "./store/mercadoStore";
import Modal from "../_components/Modal";
import IntegrarModal from "./_components/modals/IntegrarModal";
import IntegrarCard from "./_components/cards/IntegrarCard";
import DashboardMercado from "./_components/DashboardMercado";

export default function MercadoPagoView() {
  const location = useLocation();
  const idEmpresa = Number(localStorage.getItem("_ie"));

  const [modalOpen, setModalOpen] = useState(false);

  // Zustand store
  const integracion = useMercadoStore((s) => s.integracion);
  const setIntegracion = useMercadoStore((s) => s.setIntegracion);
  const datosUserMp = useMercadoStore((s) => s.datosUserMp);
  const setDatosUserMp = useMercadoStore((s) => s.setDatosUserMp);

  useEffect(() => {
    if (!integracion && idEmpresa) {
      consultaMercado(idEmpresa).then((data) => {
        setIntegracion(data);
      });
    }
  }, [integracion, idEmpresa, setIntegracion]);

  const integracionActiva = !!(
    integracion?.data &&
    Array.isArray(integracion.data) &&
    integracion.data.length > 0
  );

  useEffect(() => {
    if (integracionActiva && !datosUserMp) {
      obtieneDatosUserMp().then((data) => {
        setDatosUserMp(data);
      });
    }
  }, [integracionActiva, datosUserMp, setDatosUserMp]);

  useEffect(() => {
    const storedOpen = localStorage.getItem("mp_modalOpen");
    // const storedAction = localStorage.getItem("mp_modalAction");
    if (storedOpen === "true") setModalOpen(true);
    // if (storedAction) setModalAction(storedAction);
  }, []);

  // Persist modal state to localStorsage
  useEffect(() => {
    localStorage.setItem("mp_modalOpen", modalOpen ? "true" : "false");
  }, [modalOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code && window.opener) {
      // Envía el code a la ventana principal
      window.opener.postMessage({ mp_code: code }, "*");
      // Cierra el popup
      window.close();
    }
  }, [location.search]);

  return (
    <div className="flex flex-col h-full w-full">
      {integracionActiva && datosUserMp && datosUserMp.data ? (
        <DashboardMercado />
      ) : !integracionActiva ? (
        <IntegrarCard setModalOpen={setModalOpen} />
      ) : null}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <IntegrarModal />
      </Modal>
    </div>
  );
}
