var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y sala son necesarios');
}

var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala')
};

socket.on('connect', function() {
	console.log('Conectado al servidor');
	console.log('Usuario: ', usuario);

	socket.emit('inChat', usuario, function(resp) {
		console.log('Usuarios conectados', resp);
		renderUsersChatRoom(resp);
	});
});

socket.on('nuevoUser', function(mensaje) {
	console.log('Perdimos conexión con el servidor ', mensaje);
	renderUserMensaje(mensaje, false);
	scrollBottom();
});

// escuchar
socket.on('disconnect', function(mensaje) {
	console.log('Perdimos conexión con el servidor ', mensaje);
	renderUserMensaje(mensaje, false);
	scrollBottom();
});

// Escuchar información
socket.on('userdeleted', function(mensaje) {
	console.log('Servidor:', mensaje);
	renderUserMensaje(mensaje, false);
	scrollBottom();
});

// Escuchar cambios de usuarios

socket.on('listaPersona', function(mensaje) {
	console.log('Los usuarios:', mensaje);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
	console.log('Servidor Crearmensaje:', mensaje);
	renderUserMensaje(mensaje, false);
	scrollBottom();
});

//mensaje privado
socket.on('mensajePrivado', function(mensaje) {
	console.log('Los usuarios:', mensaje);
});
