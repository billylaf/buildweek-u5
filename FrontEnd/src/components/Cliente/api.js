const BASE = "http://localhost:8080"

function authHeader() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getClienti({ nome = "", page = 0, size = 10 }) {
  const res = await fetch(
    `${BASE}/clienti?nome=${nome}&page=${page}&size=${size}`,
    {
      headers: {
        ...authHeader(),
      },
    },
  )

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }

  return res.json()
}

export async function getFatture({ clienteId, size = 50 }) {
  const res = await fetch(
    `${BASE}/fatture?clienteId=${clienteId}&size=${size}`,
    {
      headers: {
        ...authHeader(),
      },
    },
  )
  return res.json()
}

export async function createCliente(data) {
  const res = await fetch(`${BASE}/clienti`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateCliente(id, data) {
  const res = await fetch(`${BASE}/clienti/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteCliente(id) {
  await fetch(`${BASE}/clienti/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  })
}

// ---------------------------------------------------------------
// COMUNI
// ---------------------------------------------------------------

export async function getComuni() {
  const res = await fetch(`${BASE}/comuni`, {
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }

  return res.json()
}

export async function getIndirizziByCliente(clienteId) {
  const res = await fetch(`${BASE}/indirizzi/cliente/${clienteId}`, {
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }

  return res.json()
}

export async function createIndirizzo(data) {
  const res = await fetch(`${BASE}/indirizzi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }

  return res.json()
}

export async function updateIndirizzo(id, data) {
  const res = await fetch(`${BASE}/indirizzi/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }

  return res.json()
}

export async function deleteIndirizzo(id) {
  const res = await fetch(`${BASE}/indirizzi/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error("Errore API: " + res.status)
  }
}
