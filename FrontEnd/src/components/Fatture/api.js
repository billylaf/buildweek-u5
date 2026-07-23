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
    throw new Error(`Errore API: ${res.status} - ${res.statusText}`)
  }

  return res.json()
}

// ==================== FATTURE ====================

export async function getFatture(params) {
  let queryString = ""

  if (params instanceof URLSearchParams) {
    queryString = params.toString()
  } else if (typeof params === "object" && params !== null) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value)
      }
    })
    queryString = searchParams.toString()
  }

  const url = `${BASE}/fatture${queryString ? `?${queryString}` : ""}`

  const res = await fetch(url, {
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error(`Errore API: ${res.status} - ${res.statusText}`)
  }

  return res.json()
}

export async function getFattura(id) {
  const res = await fetch(`${BASE}/fatture/${id}`, {
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error(`Errore API: ${res.status} - ${res.statusText}`)
  }

  return res.json()
}

export async function createFattura(data) {
  const res = await fetch(`${BASE}/fatture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || `Errore API: ${res.status}`)
  }

  return res.json()
}

export async function updateFattura(id, data) {
  const res = await fetch(`${BASE}/fatture/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || `Errore API: ${res.status}`)
  }

  return res.json()
}

export async function patchStatoFattura(id, statoId) {
  const res = await fetch(`${BASE}/fatture/${id}/stato?statoId=${statoId}`, {
    method: "PATCH",
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || `Errore API: ${res.status}`)
  }

  return res.json()
}

export async function deleteFattura(id) {
  const res = await fetch(`${BASE}/fatture/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error(`Errore API: ${res.status} - ${res.statusText}`)
  }
}

export async function getStatiFattura() {
  const res = await fetch(`${BASE}/stati-fattura/all-list`, {
    headers: {
      ...authHeader(),
    },
  })

  if (!res.ok) {
    throw new Error(`Errore API: ${res.status} - ${res.statusText}`)
  }

  return res.json()
}

export function formatDate(dateStr) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString("it-IT")
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "€ 0,00"
  return `€ ${amount.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function handleApiError(error) {
  console.error("API Error:", error)
  return (
    error.message ||
    "Si è verificato un errore durante la comunicazione con il server"
  )
}
