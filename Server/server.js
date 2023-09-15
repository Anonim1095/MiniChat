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

let connections = {}

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
    console.log(socket.id+" Has been connected")
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
        console.log(socket.id+" Send message")
        connect(socket)
        let user = get(socket)
        let clr = user.ColorName || null
        ,name = user.ProvidedName || "Noname"
        io.emit('message', {
            type:"message",
            author:name,
            content:msg.content,
            color:clr
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

