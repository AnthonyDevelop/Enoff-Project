require('dotenv').config()
const express = require("express")
const app = express();
const cors = require('cors')
//const fs = require("fs");

const notificacionModels = require('./models/notificacion')
// const { createServer } = require("https")
 const { createServer } = require("http")
const { Server } = require('socket.io');
// const key = fs.readFileSync('public/key.pem', 'utf8');
// const cert = fs.readFileSync('public/cert.pem', 'utf8')
// const ca = fs.readFileSync('public/csr.pem', 'utf8');
// const credentials = {
//     cert,
//     key,
//     ca,
// }
//const httpsServer = createServer(credentials, app)
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
        //origin:"https://enoff.com.ar"
    },
})
app.use(express.json());
app.use(cors())
httpServer.listen(8006, () => {
    console.log("Backend server is running!");
})
let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
    //cuando se conecta
    console.log('A ingresado un usuario.')

    //agarro userId y el socketID del usuario
    socket.on('addUser', userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on('sendNotification', ({ contenido, user_id, estado }) => {
        console.log(user_id)
        const fecha = require('moment')().format('YYYY-MM-DD HH:mm:ss')
        const user = getUser(user_id)
        if (user !== undefined) {
            io.to(user.socketId).emit("getNotificacion", {
                contenido,
                user_id,
                fecha,
                estado
            })
            notificacionModels.setNotificacion(contenido, user_id, estado)
            //agregar a base de datos la notificacion
        } else {
            //agregar a base de datos la notificacion
            notificacionModels.setNotificacion(contenido, user_id, estado)
        }

    })

    socket.on('sendNotificationAll', ({ contenido }) => {
        const allUser = notificacionModels.allUser(); // traigo todos usuarios de la bd a ser notificados        
        const fecha = require('moment')().format('YYYY-MM-DD HH:mm:ss')
        allUser.forEach(element => {
            const user = getUser(element.id) //busco al usuario si esta conectado
            if (user !== undefined) {
                io.to(user.socketId).emit("getNotificacion", {
                    contenido,
                    user_id,
                    fecha,
                    estado
                })
                notificacionModels.setNotificacion(contenido, user_id, estado)
                //agregar a base de datos la notificacion
            } else {
                //agregar a base de datos la notificacion
                notificacionModels.setNotificacion(contenido, user_id, estado)
            }
        });
    })

    //cuando se desconecta
    socket.on('disconnect', () => {
        console.log('Se desconecto un usuario')
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
app.post('/client/notificaciones', function (req, res) {
    
    const fecha = require('moment')().format('YYYY-MM-DD HH:mm:ss')
    const user = getUser(req.body.user_id) //busco al usuario si esta conectado
    if (user !== undefined) {
        io.to(user.socketId).emit("getNotificacion",{
            contenido: req.body.contenido,
            user_id: req.body.user_id,
            fecha,
            estado: req.body.estado
        })
    }
    res.status(200).send({message:'Procesado'});
});
