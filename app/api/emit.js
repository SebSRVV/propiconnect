// pages/api/emit.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { event, data } = req.body;
      const io = global.io;
  
      if (io) {
        io.emit(event, data);
        res.status(200).json({ message: 'Evento emitido' });
      } else {
        res.status(500).json({ message: 'Socket no inicializado' });
      }
    } else {
      res.status(405).end();
    }
  }
  