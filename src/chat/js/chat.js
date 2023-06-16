console.log('hello js');

"use strict"
const socket = io();
//socket.data.username = "2kooong2";

const info = {
    user_id: "2kooong2"
}
socket.emit("joined", info);

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");

sendButton.addEventListener("click", ()=>{
    const param = {
        name: nickname.value,
        msg: chatInput.value
    }
    socket.emit("chatting", param);
//대화방, 메시지
});


socket.on("chatting", (data)=>{

console.log(data);
    const li = document.createElement("li");
    li.innerText = `${data.name} : ${data.msg}`
    chatList.appendChild(li);
    //alert(data);
})

console.log(socket);