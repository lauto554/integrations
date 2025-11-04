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

export async function obtieneMercadoTerminales() {
  try {
    const url = `/mercado/obtener_terminales`;
    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function cambiarModoTerminal(device_id: string, mode: string) {
  try {
    const url = `/mercado/cambiar_modoterminal`;
    const request = await api.post(url, { device_id, mode });

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function asignarStoreId(userId: string, storeId: string, externalId: string) {
  try {
    const url = `/mercado/asignar_storeid/${userId}/${storeId}/${externalId}`;

    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function asignarPosId(posId: string, externalId: string) {
  try {
    const url = `/mercado/asignar_posid/${posId}/${externalId}`;

    const request = await api.get(url);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function createPointOrder(
  deviceId: string,
  description: string,
  amount: string,
  print: number
) {
  try {
    const url = `/mercado/crear_pointorder`;

    const body = {
      device_id: deviceId,
      description,
      amount,
      print,
    };

    const request = await api.post(url, body);

    return request.data;
  } catch (error) {
    throw error;
  }
}
