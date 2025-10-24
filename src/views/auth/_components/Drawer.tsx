import LoginCard from "../LoginCard";

type DrawerProps = {
  openDrawer: boolean;
  setModalOpen: (open: boolean) => void;
  setModalType: React.Dispatch<React.SetStateAction<"register" | "forgot-password" | null>>;
  onClose: () => void;
};

export default function Drawer({ openDrawer, setModalOpen, setModalType, onClose }: DrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end pointer-events-none transition-all duration-300 ${
        openDrawer ? "" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto ${
          openDrawer ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`relative bg-[#181a20] w-full max-w-xs h-full shadow-xl border-l border-[#2d3344] flex flex-col p-8 pointer-events-auto transition-transform duration-300 ${
          openDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-blue-400 mb-2 text-center">Sign In</h2>

          <LoginCard />

          <div className="mt-4 flex flex-col items-start gap-2">
            <span className="text-sm text-gray-400">
              ¿Aún no tienes cuenta?
              <button
                type="button"
                className="ml-2 text-blue-400 font-semibold hover:underline transition px-0 py-0 bg-transparent border-none cursor-pointer"
                onClick={() => {
                  setModalType("register");
                  setModalOpen(true);
                }}
              >
                Registrate
              </button>
            </span>
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition px-0 py-0 bg-transparent border-none cursor-pointer"
              onClick={() => {
                setModalType("forgot-password");
                setModalOpen(true);
              }}
            >
              Olvidé mi contraseña
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
