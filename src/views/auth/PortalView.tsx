import { useState } from "react";
import Header from "./_components/Header";
import Drawer from "./_components/Drawer";
import Modal from "../app/_components/Modal";
import LoginCard from "./_components/LoginForm";
import RegisterForm from "./_components/RegisterForm";

export default function PortalView() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"register" | "forgot-password" | null>(null);

  const logos = [
    // "ARCA-logo.png",
    "clover-logo.png",
    "dropbox-logo.png",
    "mercadopago-logo.png",
    "meta-logo.png",
    "twiliosendgrid-logo.png",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-blue-900">
      <Header setDrawerOpen={setDrawerOpen} />

      <section className="w-full flex flex-col items-center justify-center mt-16 mb-8 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-6 w-full flex flex-col items-center md:items-start">
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-300 to-blue-500 mb-2 leading-tight">
                Integrá. Potenciá. Automatizá.
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-200 font-semibold mb-2">
                La plataforma para conectar tus operaciones con las mejores empresas y servicios.
              </h2>
            </div>
            <div className="w-full flex flex-col items-center md:items-start">
              <div className="bg-blue-800/30 border border-blue-500 rounded-xl px-6 py-4 shadow-lg max-w-lg">
                <span className="text-blue-300 text-lg md:text-xl font-bold block mb-1">
                  ¿Listo para empezar?
                </span>
                <span className="text-white text-base md:text-lg font-medium">
                  Registrate si aún no lo hiciste o iniciá sesión para acceder a tu espacio
                  personalizado y seguro.
                </span>
              </div>
            </div>

            {/* Carrusel de logos */}
            <div className="w-full mt-6">
              <div className="flex gap-6 py-2 px-1 ">
                {logos.map((logo) => (
                  <div
                    key={logo}
                    className="flex shrink-0 items-center justify-center h-16 w-40 rounded-lg shadow border border-gray-800 bg-gray-100"
                  >
                    <img
                      src={`/logos/${logo}`}
                      alt={logo.replace(/[-_]/g, " ").replace(/\.png|\.jpg/, "")}
                      className="max-h-24 "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Drawer
        openDrawer={drawerOpen}
        setModalOpen={setModalOpen}
        setModalType={setModalType}
        onClose={() => setDrawerOpen(false)}
      />

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {modalType === "register" ? (
            <RegisterForm />
          ) : modalType === "forgot-password" ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Olvidaste tu contraseña</h2>
              <LoginCard />
            </div>
          ) : null}
        </Modal>
      )}
    </div>
  );
}
