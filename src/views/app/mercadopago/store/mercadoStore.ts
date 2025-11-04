import { create } from "zustand";

interface MercadoState {
  integracion: any | null;
  setIntegracion: (data: any) => void;
  datosUserMp: any | null;
  setDatosUserMp: (data: any) => void;
  sucursales: any[];
  setSucursales: (data: any[]) => void;
  cajas: any[];
  setCajas: (data: any[]) => void;
  terminales: any[];
  setTerminales: (data: any[]) => void;
}

export const useMercadoStore = create<MercadoState>((set) => ({
  integracion: (() => {
    const stored = localStorage.getItem("mp_integracion");
    return stored ? JSON.parse(stored) : null;
  })(),
  setIntegracion: (data) => {
    set({ integracion: data });
    localStorage.setItem("mp_integracion", JSON.stringify(data));
  },
  datosUserMp: (() => {
    const stored = localStorage.getItem("mp_datosUserMp");
    return stored ? JSON.parse(stored) : null;
  })(),
  setDatosUserMp: (data) => {
    set({ datosUserMp: data });
    localStorage.setItem("mp_datosUserMp", JSON.stringify(data));
  },
  sucursales: (() => {
    const stored = localStorage.getItem("mp_sucursales");
    return stored ? JSON.parse(stored) : [];
  })(),
  setSucursales: (data) => {
    set({ sucursales: data });
    localStorage.setItem("mp_sucursales", JSON.stringify(data));
  },
  cajas: (() => {
    const stored = localStorage.getItem("mp_cajas");
    return stored ? JSON.parse(stored) : [];
  })(),
  setCajas: (data) => {
    set({ cajas: data });
    localStorage.setItem("mp_cajas", JSON.stringify(data));
  },
  terminales: (() => {
    const stored = localStorage.getItem("mp_terminales");
    return stored ? JSON.parse(stored) : [];
  })(),
  setTerminales: (data) => {
    set({ terminales: data });
    localStorage.setItem("mp_terminales", JSON.stringify(data));
  },
}));
