import axios, { AxiosError } from "axios";

export const checkAuth = async () => {
  try {
    const isLoggedIn = await axios.get(
      "https://medguard.vercel.app/api/healthworker",
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    return isLoggedIn.data;
  } catch (error) {
    return (error as AxiosError).response!.data;
  }
};
