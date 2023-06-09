console.log("Got there")
const socket = io()

$form = document.querySelector('#message-form')
$formInput = $form.elements.input
$formButton = $form.elements.submitBtn
$messagesContainer = document.querySelector("#messages")
$locationButton = document.querySelector("#locationBtn")
$sideBar = document.querySelector("#sidebar")

messagesTemplate = document.querySelector('#messages-template').innerHTML
locationTemplate = document.querySelector('#location-template').innerHTML
sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoScroll = () => {
    const $newMessage = $messagesContainer.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visisbleHeight = $messagesContainer.offsetHeight
    const containerHeight = $messagesContainer.scrollHeight
    const scrollOffset = $messagesContainer.scrollTop + visisbleHeight

    if((containerHeight - newMessageHeight) <= scrollOffset) {
        $messagesContainer.scrollTop = $messagesContainer.scrollHeight
    }


}

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

$form.addEventListener("submit", (e) => {
    e.preventDefault()
    $formButton.setAttribute('disabled', 'disabled')
    message = $formInput.value
    socket.emit("newMessage", message, (error) => {
        $formButton.removeAttribute('disabled')
        $formInput.value = ''
        $formInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Delivered')
    })
})

$locationButton.addEventListener('click', (e) => {
    e.target.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        alert('Location Services not supported!')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            e.target.removeAttribute('disabled')
            return console.log("Location Shared")
        })
    })
})

socket.on("message", (message) => {
    const html = Mustache.render(messagesTemplate, {
        sender: message.sender,
        text: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on("sentLocation", (locationUrl) => {
    const html = Mustache.render(locationTemplate, {
        url: locationUrl.url,
        createdAt: moment(locationUrl.createdAt).format("h:mm a")
    })
    $messagesContainer.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('usersList', (roomInfo) => {
    const html = Mustache.render(sidebarTemplate, {
        room: roomInfo.room,
        users: roomInfo.users
    })
    $sideBar.innerHTML = html
})
socket.emit("join", { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})