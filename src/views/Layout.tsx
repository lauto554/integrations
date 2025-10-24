import Sidebar from "./app/_components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-blue-500 to-purple-600">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
