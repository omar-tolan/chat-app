console.log("Got there")
const socket = io()

$form = document.querySelector('#message-form')
$formInput = $form.elements.input
$formButton = $form.elements.submitBtn

$locationButton = document.querySelector("#locationBtn")

$form.addEventListener("submit", (e) => {
    e.preventDefault()
    $formButton.setAttribute('disabled', 'disabled')
    message = $formInput.value
    socket.emit("newMessage", message, (error) => {
        $formButton.removeAttribute('disabled')
        $formInput.value = ''
        $formInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Delivered')
    })
})

$locationButton.addEventListener('click', (e) => {
    e.target.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
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

socket.on("message", (msg) => {
    console.log(msg)
})