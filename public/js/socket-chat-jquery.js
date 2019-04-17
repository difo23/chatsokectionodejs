var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y sala son necesarios');
}

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatBox = $('#divChatbox');

var usuario = {
	nombre: params.get('nombre'),
	sala: params.get('sala')
};

function renderUsersChatRoom(users) {
	console.log('Usuarios Renderizados :', users);
	let html = '';

	html += '<li>';
	html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
	html += '</li>';

	for (let i = 0; i < users.length; i++) {
		html += '<li>';
		html +=
			' <a data-id="' +
			users[i].id +
			'" href="javascript:void(0)"><img src="assets/images/users/' +
			i +
			'.jpg" alt="user-img" class="img-circle"> <span>' +
			users[i].name +
			' <small class="text-success">online</small></span></a>';
		html += '</li>';
	}
	divUsuarios.html(html);
}

function renderUserMensaje(mensaje, own) {
	console.log('mensaje Renderizado :', mensaje);
	let html = '';
	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours() + ':' + fecha.getMinutes();
	var adminClass = 'info';
	if (mensaje.nombre === 'admin') {
		adminClass = 'danger';
	}

	if (own) {
		html += '<li class="reverse">';
		html += '<div class="chat-content">';
		html += '	<h5>Steave Doe</h5>';
		html += '	<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
		html += '</div>';
		html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
		html += '<div class="chat-time">' + hora + '</div>';
		html += '</li>';
	} else {
		html += ' <li class= "animated fadeIn">';

		if (mensaje.nombre !== 'admin') {
			html += ' <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		}
		html += ' <div class="chat-content">';
		html += '	 <h5>' + mensaje.nombre + '</h5>';
		html += '	 <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
		html += ' </div>';
		html += ' <div class="chat-time">' + hora + '</div>';
		html += '</li>';
	}

	divChatBox.append(html);
}

function scrollBottom() {
	// selectors
	var newMessage = divChatBox.children('li:last-child');

	// heights
	var clientHeight = divChatBox.prop('clientHeight');
	var scrollTop = divChatBox.prop('scrollTop');
	var scrollHeight = divChatBox.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		divChatBox.scrollTop(scrollHeight);
	}
}

divUsuarios.on('click', 'a', function() {
	var id = $(this).data('id');
	if (id) {
		console.log('Usuario Click: ', id);
	}
});

formEnviar.on('submit', function(e) {
	e.preventDefault();

	if (txtMensaje.val().length === 0) {
		return;
	}
	console.log(txtMensaje.val());
	//Enviar información
	socket.emit(
		'crearMensaje',
		{
			nombre: usuario.nombre,
			mensaje: txtMensaje.val()
		},
		function(resp) {
			console.log('respuesta server: ', resp);
			renderUserMensaje(resp, true);
			scrollBottom();
			txtMensaje.val('').focus();
		}
	);
});
