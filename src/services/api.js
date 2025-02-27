// /src/services/api.js

export const API_URL = "https://gymsmart.azurewebsites.net/api";
//export const API_URL = "https://localhost:7113/api";

// Evita que múltiples peticiones hagan refresh simultáneamente
let isRefreshing = false;

// Cola de peticiones que esperan a que termine el refresh
let refreshSubscribers = [];

/**
 * Llama al endpoint /api/Auth/refresh para obtener un nuevo token.
 * Requiere que guardes `refreshToken` y `token` en localStorage.
 */
async function refreshSession() {
  isRefreshing = true;

  try {
    const oldToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!oldToken || !refreshToken) {
      throw new Error("No hay token o refreshToken en localStorage.");
    }

    const response = await fetch(`${API_URL}/Auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oldToken}`, // enviamos el token antiguo
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Error al refrescar el token");
    }

    const data = await response.json();
    // Guardar el nuevo token y refreshToken
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Notificamos a las peticiones en cola que ya tenemos nuevo token
    refreshSubscribers.forEach((callback) => callback(data.token));
    refreshSubscribers = [];

    return data.token;
  } finally {
    isRefreshing = false;
  }
}

/**
 * Realiza una petición a la API con fetch y maneja automáticamente
 * el refresh del token si recibimos un 401 (Unauthorized).
 *
 * @param {string} endpoint - Ruta de la API (ej: "usuarios")
 * @param {string} [method="GET"] - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} [body=null] - Datos a enviar en el body
 * @param {boolean} [reintento=false] - Para evitar bucles infinitos de refresh
 * @returns {Promise<any>} - Respuesta en formato JSON
 */
export const apiRequest = async (endpoint, method = "GET", body = null, reintento = false) => {
  const token = localStorage.getItem("token");

  let headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Hacemos la petición
  const response = await fetch(`${API_URL}/${endpoint}`, options);

  // Si el token expiró y no hemos reintentado todavía, hacemos refresh
  if (response.status === 401 && !reintento) {
    // Si ya se está refrescando, esperamos a que termine
    if (isRefreshing) {
      // Devolvemos una promesa que se resuelve cuando se complete el refresh
      return new Promise((resolve, reject) => {
        refreshSubscribers.push(async (newToken) => {
          try {
            const newHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            const newResponse = await fetch(`${API_URL}/${endpoint}`, {
              ...options,
              headers: newHeaders,
            });
            if (!newResponse.ok) {
              throw new Error("Error tras refrescar token");
            }
            const result = await newResponse.json();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    } else {
      // Hacemos refresh de token directamente
      try {
        const newToken = await refreshSession();
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        const newResponse = await fetch(`${API_URL}/${endpoint}`, {
          ...options,
          headers: newHeaders,
        });
        if (!newResponse.ok) {
          throw new Error("Error tras refrescar token");
        }
        return newResponse.json();
      } catch (error) {
        throw error;
      }
    }
  }

  // Si la respuesta es distinta de 401 o ya reintentamos, lanzamos error si no es OK
  if (!response.ok) {
    throw new Error("Error en la petición: " + response.status);
  }

  // Si todo va bien, devolvemos el JSON
  return response.json();
};