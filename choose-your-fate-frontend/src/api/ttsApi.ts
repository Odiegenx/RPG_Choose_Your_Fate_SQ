const API_URL = import.meta.env.VITE_API_URL;

export async function retreiveCall(
  apiPath: string,
  text: string,
  token: string
) {
  const res = await fetch(`${API_URL}choose-your-fate/${apiPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: text,
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res;
}