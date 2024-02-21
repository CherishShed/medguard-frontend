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
