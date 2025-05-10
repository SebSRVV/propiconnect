// scripts/updatePropiedades.ts
import db from '../lib/db';

async function updatePropiedades() {
  try {
    const [result] = await db.execute(
      `UPDATE propiedad SET estado = 'inactivo' WHERE estado = 'activo' AND fecha_publicacion < DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    console.log('Actualización completada:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error actualizando propiedades:', error);
    process.exit(1);
  }
}

updatePropiedades();
