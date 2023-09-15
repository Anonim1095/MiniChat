import { io, Manager } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {updateTime,newServer,newDm,connect,disconnectMe,newMessage,formatTime,serverExist} from "./functions.mjs";

//const socket = io("localhost:3000");

let connected = false

//Standart server
let standartServerId = 0
let onStandartServer = true
const standartServer = document.querySelector(".standartServer")

let serversCreated = [
    {
        id: 12,
        name: "Test Channel",
    }
]

let socket
let config = {
    name:   null,
    color:  null,
    channel:standartServerId,
}

// ELEMENTS -------------------------------------------------------------------------------------------------
const time = document.querySelector("#time")
const servers = document.querySelector(".servers")
const dms = document.querySelector(".dms")
const hostaddress = document.querySelector("#hostname")
const contStatus = document.querySelector('#connectionStatus')

const serverIdInput = document.querySelector("#serverPass")
// BUTTONS --------------------------------------------------------------------------------------------------
const connectButton = document.querySelector("#connectionButton")
const colorChoose = document.querySelector("#colorChoose")
const nameInput = document.querySelector("#nameinput")

const serverAddButt = document.querySelector("#newServer")
//MESSAGING -------------------------------------------------------------------------------------------------
const sendButton = document.querySelector("#send")
const messageBox = document.querySelector("#message")
const chat       = document.querySelector(".content_chat")

updateTime(time)
setInterval(function() {
    updateTime(time)
},1000)


function updateChatbox() {
    let items = chat.querySelectorAll(".message")
    for (let i = 0; i < items.length; i++) {
        items[i].remove();
    }
}

// INITIALIZING ---------------------------------------------------------------------------------------------
function connectServer(element) {
    let id = element.id.slice(1)
    if (id == standartServerId) {
        onStandartServer = true
    }
}

standartServer.addEventListener('click', () => {connectServer(standartServer)})
sendButton.addEventListener('click', () => {
    if (connected) {
        socket.emit('chat message', {
            content: messageBox.value,
            color: colorChoose.value,
            name: nameInput.value
        })
        messageBox.value = ""
    } else {
        console.warn("Not connected.")
    }
})

connectButton.addEventListener('click', () => {
    if (connected && socket) {
        disconnectMe(socket)
        connected = false
        contStatus.innerText = "Status: Disconnected"
    } else {
        let trys = 0
        contStatus.innerText = "Status: Something went wrong"
        while(true) {
            trys++
            if(trys > 10) {
                break
            }
            socket = connect(hostaddress.value)
            if(socket != null) {
                contStatus.innerText = "Status: Connected"
                break
            }
        }
        connected = true
        socket.on('message', (message) => {
            if(message.type == "message") {
                newMessage({
                    id:message.id,
                    name:message.author,
                    text:message.content,
                    color:message.color,
                },chat)
            }
        })
    }
})
serverAddButt.addEventListener('click', () => {
    let serverDiv = newServer({
        id: serverIdInput.value
    },servers)
    serverIdInput.value = ""
    connectServer(serverDiv)
})