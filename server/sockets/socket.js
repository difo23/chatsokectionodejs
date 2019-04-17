const { io } = require('../server');

const RoomChat = require('../classes/RoomChat');
const { crearMensaje } = require('../utils');
const room = new RoomChat();

io.on('connection', (client) => {
	console.log('Usuario conectado');

	client.on('inChat', (usuario, callback) => {
		if (!usuario.nombre) {
			return callback({
				error: true,
				mensaje: 'El nombre es necesario'
			});
		}
		if (usuario.sala) {
			room.setRoomType(usuario.sala);
		}
		client.join(room.roomType);
		console.log('Usuario en el chat: ', usuario);

		let users = room.addUser(client.id, usuario.nombre);
		let usersByRoom = room.getUsersByRoom(room.roomType);
		client.broadcast
			.to(room.roomType)
			.emit('nuevoUser', crearMensaje('admin', `${usuario.nombre} entro en el chat`));
		console.log('Usuarios conectados: ', users);
		client.broadcast.to(room.roomType).emit('listaPersona', usersByRoom);
		callback(usersByRoom);
	});

	client.on('crearMensaje', (data, callback) => {
		let user = room.getUser(client.id);
		let mensaje = crearMensaje(user.name, data.mensaje);
		client.broadcast.to(user.roomType).emit('crearMensaje', mensaje);
		callback(mensaje);
	});

	client.on('disconnect', () => {
		let userDeleted = room.deleteUser(client.id);
		console.log('Usuario borrado: ', userDeleted);

		client.broadcast
			.to(userDeleted.roomType)
			.emit('userdeleted', crearMensaje('admin', ` ${userDeleted.name} abandono el chat`));

		client.broadcast.to(userDeleted.roomType).emit('listaPersona', room.getUsersByRoom(userDeleted.roomType));
	});

	client.on('mensajePrivado', (data) => {
		let user = room.getUser(client.id);
		let mensaje = crearMensaje(user.name, data.mensaje);
		client.broadcast.to(data.toID).emit('mensajePrivado', mensaje);
	});
});
