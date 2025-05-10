import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const [rows] = await db.query('SELECT * FROM propiedad ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}
