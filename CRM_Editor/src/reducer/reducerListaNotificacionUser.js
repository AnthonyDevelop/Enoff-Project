import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store";

function reducerListaNotificacionUser (state = store.listNotifUser, action){
    switch(action.type){
        case actionTypes.SET_LISTA_NOTIFICACIONES_USER:
            let listaNotifUser = action.data
            return Object.assign({}, state, {
                data: listaNotifUser,
            })
            default:
                return state
    }
}

export default reducerListaNotificacionUser;