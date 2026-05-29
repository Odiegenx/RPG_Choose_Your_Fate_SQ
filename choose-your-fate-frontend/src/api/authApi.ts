const API_URL = import.meta.env.VITE_API_URL;

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function apiGet(apiPath: string, options?: { token: string | null }) {
  const res = await fetch(`${API_URL}choose-your-fate/${apiPath}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${options ? options.token : null}`,
      "X-Data-Source": "SQL"
     },
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}

export async function apiPost(
  apiPath: string,
  body: unknown,
  options?: { token: string | null }
) {
  const res = await fetch(`${API_URL}choose-your-fate/${apiPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options ? options.token : null}`,
      "X-Data-Source": "SQL",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}
