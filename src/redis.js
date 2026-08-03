const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN

async function redisCommand(command, ...args) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.warn('Upstash Redis não configurado. Usando localStorage como fallback.')
    return null
  }
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  })
  const data = await res.json()
  if (data.error) {
    console.error('Redis error:', data.error)
    return null
  }
  return data.result
}

export async function getPedidos() {
  const result = await redisCommand('GET', 'pedidos')
  if (!result) return null
  try { return JSON.parse(result) } catch { return null }
}

export async function savePedidos(pedidos) {
  return redisCommand('SET', 'pedidos', JSON.stringify(pedidos))
}
