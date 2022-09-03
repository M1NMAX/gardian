export async function getFetch(
  url: string,
  method: string = 'GET',
  data?: object
) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return result;
}
