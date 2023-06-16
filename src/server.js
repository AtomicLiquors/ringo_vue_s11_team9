
const express = require("express")
const http = require("http")
const app = express();
const path = require("path")
const server = http.createServer(app);

const socketIO = require("socket.io")
const io = socketIO(server);
console.log(__dirname)
app.use(express.static(path.join(__dirname, "chat")));

const PORT = process.env.PORT || 5500;

io.on("connection", (socket)=>{
  console.log('connected');
  socket.on('joined', (data)=>{
    userId = data.user_id;
  })
  socket.on("chatting", (data)=>{
    io.emit("chatting", data)
  })

  socket.on('disconnect', (reason)=>{
    console.log(userId);
    console.log(`연결 종료`)
    io.emit("chatting", {
      msg: userId + " has been disconnected"
    });
  });

  socket.on('error', (error)=>{
    console.log(`에러 발생: ${error}`)
  });
})

server.listen(PORT, () => console.log(`server is running ${PORT}`));