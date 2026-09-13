export default function errorMessage(error: string, status?: number) {
  throw new Error(`${error}${status ? `: ${status}` : ""}`);
}
