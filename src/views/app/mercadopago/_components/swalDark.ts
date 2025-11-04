import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export function showSwalDarkMode(options: any) {
  return Swal.fire({
    background: "#23262F",
    color: "#fff",
    confirmButtonColor: "#2563eb",
    ...options,
  });
}
