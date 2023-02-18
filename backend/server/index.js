import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import {Server, Socket} from 'socket.io';
import fileUpload from 'express-fileupload';

// mongo connection
import "../config/mongo.js";
// socket configuration
import WebSockets from "../utils/WebSockets.js";
// routes
import indexRouter from "../routes/index.js";
import userRouter from "../routes/user.js";
import gameRouter from "../routes/game.js";
import fileRouter from "../routes/file.js";
// middlewares
// import { decode } from './middlewares/jwt.js'

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

/** Get port from environment and store in Express. */
const port = process.env.PORT || "2087";
app.set("port", port);
app.use(logger("dev"));
// FILE UPLOAD
app.use(fileUpload());
// BODYPARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/game", gameRouter);
app.use("/file", fileRouter)

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.io =  new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', "DELETE", "PUT"]
    }
  });
global.io.on('connection', WebSockets.connection)

/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});