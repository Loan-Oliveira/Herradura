import { neon } from '@neondatabase/serverless';
import { senhaOk } from '../lib/auth.js';

// Só o administrador (com senha) grava os dados
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!senhaOk(req)) return res.status(401).json({ erro: 'Senha incorreta' });

  const dados = req.body;
  if (!dados || typeof dados !== 'object' || !dados.cfg) {
    return res.status(400).json({ erro: 'Dados inválidos' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`create table if not exists site_data (
      id int primary key,
      data jsonb not null,
      updated_at timestamptz default now()
    )`;
    await sql`insert into site_data (id, data) values (1, ${JSON.stringify(dados)}::jsonb)
      on conflict (id) do update set data = excluded.data, updated_at = now()`;
    res.status(200).json({ ok: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Falha ao salvar' });
  }
}
