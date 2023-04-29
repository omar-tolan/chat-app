exports.generateMessage = (message) => {
    return {
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

