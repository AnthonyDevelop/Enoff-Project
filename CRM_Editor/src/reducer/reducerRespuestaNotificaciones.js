
import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store";

function reducerRespuestaNotificaciones (state = store.respuestaNotificaciones, action){
    switch(action.type){
        case actionTypes.SET_RESPUESTA_NOTIFICACIONES:
            let respNotificacion = action.data
            return Object.assign({}, state, {
                data: respNotificacion,
            })
            default:
                return state
    }
}

export default reducerRespuestaNotificaciones;

