export default function errorMessage(error: String, status: Error) {
  throw new Error(`Ошибка: ${error}`);
}
