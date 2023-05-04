users = []

exports.addUser = (id, username, room) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            'error': 'Please enter all user information!',
            'user': undefined
        }
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {
            'error': 'Username is taken!',
            'user': undefined
        }
    }
    user = {id, username, room}
    users.push(user)
    console.log(users)
    return {user, 'error': undefined}
}

exports.removeUser = (id) => {
    const index =users.findIndex((user) => user.id === id)
    return users.splice(index, 1)[0]
}

exports.getUser = (id) => {
    return users.find((user) => {
        return user.id == id
    })
}

exports.getUsersInRoom = (roomId) => {
    return users.filter((user) => user.room === roomId.trim().toLowerCase())
}
