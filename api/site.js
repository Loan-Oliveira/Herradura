import { neon } from '@neondatabase/serverless';

// Qualquer visitante lê os dados do site (cardápio, textos, fotos)
export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`create table if not exists site_data (
      id int primary key,
      data jsonb not null,
      updated_at timestamptz default now()
    )`;
    const rows = await sql`select data from site_data where id = 1`;
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=10, stale-while-revalidate=60');
    res.status(200).json(rows[0]?.data ?? null);
  } catch (erro) {
    console.error(erro);
    res.status(200).json(null); // o site continua funcionando com os dados padrão
  }
}
