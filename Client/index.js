import { io, Manager } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {updateTime,newServer,newDm,sendMessage,connect,disconnect,getMessages,newMessage,formatTime,serverExist} from "./functions.mjs";

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
// BUTTONS --------------------------------------------------------------------------------------------------

//MESSAGING -------------------------------------------------------------------------------------------------
const sendButton = document.querySelector("#send")
const messageBox = document.querySelector("#message")
const chat       = document.querySelector(".content_chat")

updateTime(time)
setInterval(function() {
    updateTime(time)
},1000)


function updateChatbox() {

}

// INITIALIZING ---------------------------------------------------------------------------------------------
function connectServer(element) {
    let id = element.id.slice(1)
    if (id == standartServerId) {
        onStandartServer = true
    }
}

standartServer.addEventListener('click', () => {connectServer(standartServer)})