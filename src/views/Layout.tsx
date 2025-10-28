import Sidebar from "./app/_components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="max-h-screen flex bg-linear-to-br from-blue-500 to-purple-600">
      <Sidebar />
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
}
