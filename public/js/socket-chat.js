var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y sala es necesario!');
}

var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala')
};

socket.on('connect', function() {
	console.log('Conectado al servidor');
	socket.emit('inChat', usuario, function(resp) {
		console.log('Usuarios conectados cliente ', resp);
	});
});

// escuchar
socket.on('disconnect', function(mensaje) {
	console.log('Perdimos conexión con el servidor ', mensaje);
});

// Enviar información
// socket.emit(
// 	'crearMensaje',
// 	{
//
// 		mensaje: 'Hola Mundo'
// 	},
// 	function(resp) {
// 		console.log('respuesta server: ', resp);
// 	}
// );

// Escuchar información
socket.on('userdeleted', function(mensaje) {
	console.log('Servidor:', mensaje);
});

// Escuchar cambios de usuarios

socket.on('listaPersona', function(mensaje) {
	console.log('Los usuarios:', mensaje);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
	console.log('Servidor Crearmensaje:', mensaje);
});

//mensaje privado
socket.on('mensajePrivado', function(mensaje) {
	console.log('Los usuarios:', mensaje);
});
