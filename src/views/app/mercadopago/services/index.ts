import api from "../../../../lib/api";

export async function consultaMercado(empresa: number) {
  try {
    const url = `/mercado/consultaMercado/${empresa}`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function obtieneDatosAppMp() {
  try {
    const url = `/mercado/obtener_datosapp`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}
