import "server-only";

export const DEFAULT_BOOTSTRAP_USER_DISPLAY_NAME = "Diario48 Admin";

export function getBootstrapUserEmail() {
  const email = process.env.AUTH_BOOTSTRAP_EMAIL?.trim();
  if (!email) {
    throw new Error("Falta configurar AUTH_BOOTSTRAP_EMAIL en el servidor.");
  }
  return email;
}

export function getBootstrapUserPassword() {
  const password = process.env.AUTH_BOOTSTRAP_PASSWORD;
  if (!password) {
    throw new Error("Falta configurar AUTH_BOOTSTRAP_PASSWORD para crear la cuenta inicial.");
  }
  return password;
}
