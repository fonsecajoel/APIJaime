const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN

async function redis(command, ...args) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.warn('Upstash Redis não configurado. Usando localStorage como fallback.')
    return null
  }
  const res = await fetch(`${REDIS_URL}/${command}/${args.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  })
  return res.json()
}

async function redisSet(key, value) {
  if (!REDIS_URL || !REDIS_TOKEN) return null
  const res = await fetch(`${REDIS_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  })
  return res.json()
}

export async function getPedidos() {
  const result = await redis('get', 'pedidos')
  if (!result || result.result == null) return null
  return JSON.parse(result.result)
}

export async function savePedidos(pedidos) {
  return redisSet('pedidos', JSON.stringify(pedidos))
}
