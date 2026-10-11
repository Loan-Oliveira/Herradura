import { timingSafeEqual } from 'node:crypto';

// Confere a senha enviada pelo painel com a variável ADMIN_PASSWORD
export function senhaOk(req) {
  const enviada = Buffer.from(String(req.headers['x-admin-password'] ?? ''));
  const certa = Buffer.from(String(process.env.ADMIN_PASSWORD ?? ''));
  return certa.length > 0 && enviada.length === certa.length && timingSafeEqual(enviada, certa);
}
