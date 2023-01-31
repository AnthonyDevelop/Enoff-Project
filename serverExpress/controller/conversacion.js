const knex = require('../db/knex')
const fecha = require('moment')().format('YYYY-MM-DD HH:mm:ss')

function setNotificacion(contenido,user,estado){
  
        knex.from('notificacion').insert(
            {
                id_user_id: user,
                date_create: fecha,
                contenido: contenido,
                estado_id: estado,
            })
            .then((response) => console.log(response),
            console.log("jhajhhdsf"))
            .catch((e) => res.json({ error: e})) 

  
}

module.exports = {
    setNotificacion
}