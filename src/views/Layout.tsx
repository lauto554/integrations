import { SiVite, SiTypescript, SiReact, SiTailwindcss } from "react-icons/si";

export default function Layout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full border border-white/20">
        <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
          Template personalizado
        </h1>
        <div className="flex gap-8 mb-6">
          <div className="flex flex-col items-center">
            <SiVite className="text-yellow-400 text-6xl drop-shadow" />
            <span className="text-lg font-bold text-yellow-200 mt-2">Vite</span>
            <span className="text-xs text-white/70">^7.1.7</span>
          </div>
          <div className="flex flex-col items-center">
            <SiTypescript className="text-blue-300 text-6xl drop-shadow" />
            <span className="text-lg font-bold text-blue-100 mt-2">TypeScript</span>
            <span className="text-xs text-white/70">~5.9.3</span>
          </div>
          <div className="flex flex-col items-center">
            <SiReact className="text-cyan-300 text-6xl animate-spin-slow drop-shadow" />
            <span className="text-lg font-bold text-cyan-100 mt-2">React</span>
            <span className="text-xs text-white/70">^19.2.0</span>
          </div>
          <div className="flex flex-col items-center">
            <SiTailwindcss className="text-sky-400 text-6xl drop-shadow" />
            <span className="text-lg font-bold text-sky-100 mt-2">TailwindCSS</span>
            <span className="text-xs text-white/70">^4.1.16</span>
          </div>
        </div>
        <p className="text-white/80 text-base mb-8 text-center max-w-md">
          Este template está listo para usar y modificar a tu gusto. ¡Comienza tu proyecto moderno
          con las mejores tecnologías!
        </p>
        <button className="px-8 py-3 rounded bg-white text-blue-600 font-bold text-lg shadow-lg hover:bg-blue-100 transition mb-4">
          ¡Comenzar!
        </button>
        <div className="w-full flex justify-end mt-2">
          <span className="text-xs font-semibold text-white/70 bg-black/20 rounded-full px-3 py-1 shadow-sm backdrop-blur-sm">
            by lauto554
          </span>
        </div>
      </div>
    </div>
  );
}
