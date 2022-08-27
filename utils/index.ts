//Utils
export function getRequestOptions(
  method: 'PATCH' | 'PUT' | 'POST',
  data: object
) {
  const requestOptions = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  return requestOptions;
}
