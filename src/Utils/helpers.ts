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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  let formattedDate: string = date.toLocaleString("en-US", options);
  formattedDate = formattedDate.replace(",", " ");
  return formattedDate.replace(",", " |");
};

export const formatNormalDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  const formattedDate: string = date.toLocaleString("en-US", options);
  return formattedDate;
};

export function formatToOriginalDate(date: Date | undefined) {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } else {
    return "";
  }
}
