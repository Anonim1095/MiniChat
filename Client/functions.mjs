export {updateTime,newServer,newDm,connect,disconnectMe,newMessage,formatTime,serverExist}
import { io, Manager } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";


// IDK FUNCTIONS ----------------------------------------------------------------------------------------
function formatTime(d) {
    if (d.getMinutes() < 10) {
        if (d.getHours() < 10) {
            return "0"+d.getHours()+":0"+d.getMinutes()
        } else {
            return d.getHours()+":0"+d.getMinutes()
        }
    } else {
        if (d.getHours() < 10) {
            return "0"+d.getHours()+":"+d.getMinutes()
        } else {
            return d.getHours()+":"+d.getMinutes()
        }
    }
}
function updateTime(timeElement) {
    const d = new Date()
    timeElement.innerText = formatTime(d)
}
function serverExist(array,serverId) {
    for(let i=0;i<array.length;i++) {
        if (array[i].id == serverId) {
            return array[i],i
        }
    }
}

// SMTH NEW ---------------------------------------------------------------------------------------------
function newServer(serverData,serverHolder) {
    let serverDiv = document.createElement("div")
    serverDiv.className = "server"
    serverDiv.id = "s"+(serverData.id || "0")
    let serverName = document.createElement("span")
    serverName.className = 'serverName'
    serverName.innerText = serverData.name || "No provided"
    let serverId = document.createElement("span")
    serverId.className = "serverId"
    serverId.innerText = "#" + (serverData.id || "0")
    let lastMessage = document.createElement("p")
    lastMessage.className = "lastMessage"
    lastMessage.innerText = "No Messages"

    serverDiv.appendChild(serverName)
    serverDiv.appendChild(serverId)
    serverDiv.appendChild(lastMessage)
    serverHolder.appendChild(serverDiv)

    return serverDiv
}
function newDm(dmData,dmHolder) {
    /*
        <div class="dm color" id="dm9">
            <span class="userName red">Coffee</span>
            <span class="userId">#9</span>
            <p class="lastMessage">No Messages</p>
        </div>
    */
    let dmDiv = document.createElement("div")
    dmDiv.classList.add("dm")
    dmDiv.id = dmData.id
    let userName = document.createElement("span")
    userName.classList.add("userName")
    if (dmData.color){ dmDiv.classList.add("color"); userName.classList.add(dmData.color) }
    userName.innerText = dmData.name || "Unknown"
    let userId = document.createElement('span')
    userId.className = "userId"
    userId.innerText = "#"+dmData.id || "#0"
    let lastMessage = document.createElement('p')
    lastMessage.className = "lastMessage"
    lastMessage.innerText = "No Messages"
    
    dmDiv.appendChild(userName)
    dmDiv.appendChild(userId)
    dmDiv.appendChild(lastMessage)
    dmHolder.appendChild(dmDiv)

    return dmDiv
}
function newMessage(data,messageHolder) {
    /*
    <div class="message" id="m8903">
        <span class="time">19:26</span>
        <span class="sender">[Coffee]</span>
        <span class="text"> Hello guys!</span>
    </div>
    */
   const d = new Date()
    let messageDiv = document.createElement("div")
    messageDiv.className = "message"
    messageDiv.id = "m"+data.id
    let time = document.createElement("span")
    time.className = "time"
    time.innerText = formatTime(d)
    let sender = document.createElement("span")
    sender.classList.add("sender")
    if (data.color) {
        sender.classList.add(`col${data.color}`)
    }
    sender.innerText = ` [${data.name}]`
    let text = document.createElement("span")
    text.className = "text"
    text.innerText = ` ${data.text}`
    messageDiv.appendChild(time).appendChild(sender).appendChild(text)
    messageHolder.appendChild(messageDiv)
}
// NETWORKING FUNCTIONS ---------------------------------------------------------------------------------
function connect(host,startConfig,protocol) {
    let openedSocket = io(host)
    if (protocol) {
        openedSocket.emit("protocol", protocol)
    } else if (startConfig) {
        openedSocket.emit("full configuration", startConfig)
    }
    return openedSocket
}
function disconnectMe(socket) {
    socket.close()
}