const User = require('./User');

class RoomChat {
	constructor() {
		this.users = [];
		this.roomType = 'default';
	}

	addUser(id, name) {
		let user = new User(id, name, this.roomType);
		this.users.push(user);
		return this.users;
	}

	setRoomType(type) {
		this.roomType = type;
	}

	getRoomType() {
		return this.roomType;
	}

	getUser(id) {
		let user = this.users.find((element) => {
			return element.id === id;
		});

		return user;
	}

	getUsers() {
		return this.users;
	}

	getUsersByRoom(room) {
		let userByRoom = this.users.filter((user) => user.roomType === room);
		return userByRoom;
	}

	deleteUser(id) {
		let personDelete = this.getUser(id);
		this.users = this.users.filter((element) => element.id != id);
		console.log(personDelete);
		return personDelete;
	}
}

module.exports = RoomChat;
