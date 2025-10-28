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

export async function obtieneDatosUserMp() {
  try {
    const url = `/mercado/obtener_datoscuenta`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function obtieneMercadoSucursales(user_id: string) {
  try {
    const url = `/mercado/obtener_sucursales/${user_id}`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function obtieneMercadoCajas() {
  try {
    const url = `/mercado/obtener_cajas`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}
