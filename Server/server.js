const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

let serversData = {
    0: {
        id:0,
        name:"standart",
        messages:[]
    }
}
let usersData = {}
let connections = {}

let messageCounter = 0
let userCounter = 0

function connect(socket) {
    if (connections[socket.id] == null) {
        connections[socket.id] = {
            "Socket": socket,
            "ProvidedName": null,
            "ColorName": null,
        }
        return true
    } else return -1
    return -1
}function disconnect(socket) {
    if (connections[socket.id] != null) {
        connections[socket.id] = null
        return true
    } else return -1
    return -1
}function get(socket) {
    if (connections[socket.id] != null) {
        return connections[socket.id]
    } else return false
    return -1
}function changeName(socket,name) {
    if (get(socket) != null) {
        get(socket).ProvidedName = name
        return true
    } else {
        return false
    }
}function changeColor(socket,color) {
    if (get(socket) != null) {
        get(socket).ColorName = color
        return true
    } else {
        return false
    }
}

app.use(express.static(__dirname + '/public'));

server.listen(3000, () => {
    console.log('Listening 3000');
});

io.on('connection', (socket) => {
    userCounter++
    console.log(socket.id+" Has been connected "+userCounter)
    let user = get(socket)
    if (user == false) {
        user = "Noname"
        connect(socket)
    } else {
        user = user.ProvidedName
    }
    io.emit('message', {
        type:"connect",
        user:user
    })
    io.on('disconnect', (socket) => {
        console.log(socket.id+" Has been disconnected")
        let user = get(socket)
        if (user == false) {
            user = "Noname"
            connect(socket)
        } else {
            user = user.ProvidedName
        }
        io.emit('message', {
            type:"disconnect",
            user:user
        })
    })
    socket.on('chat message', (msg) => {
        messageCounter++
        console.log(socket.id+" Send message "+`[${msg.content}] [${messageCounter}]`)
        connect(socket)
        let user = get(socket)
        let clr,name
        if (msg.color == null) { clr = user.ColorName || null } else { clr = msg.color || null }
        if (msg.name == null) { name = user.name || "Noname" } else { name = msg.name || "Noname" }
        io.emit('message', {
            type:"message",
            author:name,
            content:msg.content,
            color:clr,
            id:messageCounter,
        })
    })
    socket.on('configuration', (msg) => {
        console.log(socket.id+" Send request to config")
        if (msg.type == "color") {
            changeColor(socket,msg.content)
        }else if(msg.type == "name") {
            changeName(socket,msg.content)
        }
    })
    socket.on('disconnect', (msg) => {
        console.log(socket.id + " Has disconnected")
    })
})

