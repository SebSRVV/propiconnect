import { NextResponse } from 'next/server';
import db from '@/lib/db';
import cookie from 'cookie';

interface Participante {
  email: string;
  monto: number;
}

export async function POST(req: Request) {
  try {
    const { propiedadID, fechaInicio, adicionales = [] }: {
      propiedadID: number;
      fechaInicio: string;
      adicionales: Participante[];
    } = await req.json();

    if (!propiedadID || !fechaInicio) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
    }

    // Leer cookie manualmente desde el header
    const cookieHeader = req.headers.get('cookie') || '';
    const cookiesParsed = cookie.parse(cookieHeader);
    const session = cookiesParsed.session;

    if (!session) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });

    let user;
    try {
      user = JSON.parse(session);
    } catch {
      return NextResponse.json({ message: 'Sesión inválida' }, { status: 401 });
    }

    const credencialID = user.id;

    // Obtener usuario principal
    const [usuarios]: any = await db.query('SELECT id FROM usuario WHERE credencialID = ?', [credencialID]);
    if (!usuarios.length) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    const usuarioID = usuarios[0].id;

    // Obtener propiedad
    const [props]: any = await db.query('SELECT * FROM propiedad WHERE id = ?', [propiedadID]);
    if (!props.length) return NextResponse.json({ message: 'Propiedad no encontrada' }, { status: 404 });

    const propiedad = props[0];
    if (propiedad.estado !== 'disponible') {
      return NextResponse.json({ message: 'La propiedad no está disponible' }, { status: 409 });
    }

    // Crear grupo
    const [grupoResult]: any = await db.query(
      'INSERT INTO grupo (nombre, propiedadID) VALUES (?, ?)',
      [`Grupo-${usuarioID}-${Date.now()}`, propiedadID]
    );
    const grupoID = grupoResult.insertId;

    // Insertar usuario principal al grupo
    await db.query('INSERT INTO grupo_usuario (grupoID, usuarioID) VALUES (?, ?)', [grupoID, usuarioID]);

    // Crear reserva
    const [reservaResult]: any = await db.query(
      'INSERT INTO reserva (grupoID, fechaInicio, estado) VALUES (?, ?, ?)',
      [grupoID, fechaInicio, 'activa']
    );
    const reservaID = reservaResult.insertId;

    const fechaPago = new Date().toISOString().split('T')[0];
    let suma = 0;

    // Insertar pago del usuario principal (monto calculado al final)
    await db.query(
      `INSERT INTO pago (reservaID, usuarioID, monto, fechaPago, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [reservaID, usuarioID, 0, fechaPago, 'pagado']
    );

    // Procesar adicionales
    for (const participante of adicionales) {
      const { email, monto } = participante;
      if (!email || !monto || monto <= 0) continue;

      suma += monto;

      let nuevoUsuarioID: number;

      // Buscar credencial
      const [cred]: any = await db.query('SELECT id FROM credencial WHERE email = ?', [email]);

      if (cred.length) {
        const credID = cred[0].id;
        const [usr]: any = await db.query('SELECT id FROM usuario WHERE credencialID = ?', [credID]);
        if (!usr.length) continue;
        nuevoUsuarioID = usr[0].id;
      } else {
        const [newCred]: any = await db.query(
          'INSERT INTO credencial (email, password) VALUES (?, ?)',
          [email, '']
        );
        const credID = newCred.insertId;

        const [newUser]: any = await db.query(
          'INSERT INTO usuario (nombres, apellidos, telefono, tipoUsuario, credencialID) VALUES (?, ?, ?, ?, ?)',
          ['Invitado', '', '', 'Inquilino', credID]
        );
        nuevoUsuarioID = newUser.insertId;
      }

      await db.query('INSERT INTO grupo_usuario (grupoID, usuarioID) VALUES (?, ?)', [grupoID, nuevoUsuarioID]);

      await db.query(
        `INSERT INTO pago (reservaID, usuarioID, monto, fechaPago, estado)
         VALUES (?, ?, ?, ?, ?)`,
        [reservaID, nuevoUsuarioID, monto, fechaPago, 'pagado']
      );
    }

    // Calcular monto faltante para el usuario principal
    const restante = propiedad.precio - suma;
    if (restante < 0) {
      return NextResponse.json({ message: 'El monto excede el valor de la propiedad' }, { status: 400 });
    }

    await db.query(
      `UPDATE pago SET monto = ? WHERE reservaID = ? AND usuarioID = ?`,
      [restante, reservaID, usuarioID]
    );

    // Cambiar estado de la propiedad
    await db.query('UPDATE propiedad SET estado = ? WHERE id = ?', ['alquilada', propiedadID]);

    const totalUsuarios = adicionales.length + 1;

    return NextResponse.json({
      message: 'Reserva y pagos registrados con éxito',
      grupoID,
      reservaID,
      montoPorUsuario: propiedad.precio / totalUsuarios,
      usuarios: totalUsuarios
    }, { status: 201 });

  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
