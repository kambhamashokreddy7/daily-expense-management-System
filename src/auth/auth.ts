export function getInitial(email: string): string {
  return email ? email.charAt(0).toUpperCase() : "U";
}

export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}