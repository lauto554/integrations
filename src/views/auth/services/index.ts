import api from "../../../lib/api";

type signInPayload = {
  company: string;
  username: string;
  password: string;
};

export async function signIn(payload: signInPayload) {
  try {
    const url = `/auth/sign-in`;
    const request = await api.post(url, payload);

    return request.data;
  } catch (error) {
    throw error;
  }
}

export async function signUp(payload: signInPayload) {
  try {
    const url = `/auth/sign-up`;
    const request = await api.post(url, payload);

    return request.data;
  } catch (error) {
    throw error;
  }
}
