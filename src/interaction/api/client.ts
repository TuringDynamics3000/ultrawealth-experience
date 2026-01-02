const BASE_URL = process.env.TURINGOS_API ?? 'http://localhost:3000';

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(\\\\, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(\TuringOS API error: \\);
  }

  return res.json();
}
