import { senhaOk } from '../lib/auth.js';

// Usado pela tela de login do painel para validar a senha
export default function handler(req, res) {
  if (!senhaOk(req)) return res.status(401).json({ erro: 'Senha incorreta' });
  res.status(200).json({ ok: true });
}
