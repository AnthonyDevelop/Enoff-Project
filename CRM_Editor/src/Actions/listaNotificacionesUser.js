import { actionTypes } from "../Constantes/ActionTypes"

export const getListaNotificacionesUser= (data) => {
    return {
        type: actionTypes.GET_LISTA_NOTIFICACIONES_USER,
        data
    }
}

export const setListaNotificacionesUser = (data) => {
    return {
        type: actionTypes.SET_LISTA_NOTIFICACIONES_USER,
        data
    }
}