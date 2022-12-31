let socket = io()
socket.on('connect', function () {
    console.log('Connected to server.')
})
socket.on('disconnect', function () {
    console.log('Disconnected from server.')
})
socket.on('newMessage', function (message) {
    const formattedTime = new Date(message.createdAt).toLocaleString()
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime
    })
    const div= document.createElement('div')
    div.innerHTML = html
    document.querySelector('#messages').appendChild(div)
    // const formattedTime=moment(message.createdAt).format('LT')
    // const formattedTime = new Date(message.createdAt).toLocaleString()
    // console.log('newMessage', message)
    // let li = document.createElement('li');
    // li.innerText = `${message.from} ${formattedTime}:${message.text}`
    // document.querySelector('body').appendChild(li)
})

socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message)
    const formattedTime = new Date(message.createdAt).toLocaleString()
    let li = document.createElement('li');
    let a = document.createElement('a');
    li.innerText = `${message.from} ${formattedTime}:`
    a.setAttribute('target', '_blank')
    a.setAttribute('href', message.url)
    a.innerText = 'My current location'
    li.appendChild(a)
    document.querySelector('body').appendChild(li)
})


document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function () {
    })
})
document.querySelector('#send-location').addEventListener('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        //    console.log(position)  
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location')
    })
})