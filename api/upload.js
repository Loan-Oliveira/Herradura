import { put } from '@vercel/blob';
import { senhaOk } from '../lib/auth.js';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

// Recebe a foto (em base64), guarda no Vercel Blob e devolve o endereço público
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!senhaOk(req)) return res.status(401).json({ erro: 'Senha incorreta' });

  const { nome, tipo, dados } = req.body ?? {};
  if (!TIPOS.includes(tipo) || typeof dados !== 'string') {
    return res.status(400).json({ erro: 'Arquivo inválido' });
  }
  const arquivo = Buffer.from(dados, 'base64');
  if (arquivo.length > 3 * 1024 * 1024) {
    return res.status(413).json({ erro: 'Foto muito grande' });
  }

  try {
    const limpo = String(nome || 'foto.jpg').replace(/[^\w.-]/g, '_');
    const blob = await put(`site/${limpo}`, arquivo, {
      access: 'public',
      addRandomSuffix: true,
      contentType: tipo,
    });
    res.status(200).json({ url: blob.url });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Falha ao enviar a foto' });
  }
}
