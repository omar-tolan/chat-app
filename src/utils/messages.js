exports.generateMessage = (message, username) => {
    return {
        sender: username,
        text: message,
        createdAt: new Date().getTime()
    }
}

exports.generateLocation = (location) => {
    return {
        url: location,
        createdAt: new Date().getTime()
    }
}

