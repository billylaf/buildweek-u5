export function getUserRoleInfo() {
  const role = localStorage.getItem("role") || "";

  // Controlla in modo sicuro se nella stringa salvata esiste la parola "ADMIN"
  const isAdmin = role.toUpperCase().includes("ADMIN");

  return { role, isAdmin };
}
