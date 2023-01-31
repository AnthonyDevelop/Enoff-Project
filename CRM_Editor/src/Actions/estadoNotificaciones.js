import { actionTypes } from "../Constantes/ActionTypes"

export const setEstadoNotificaciones = (data) => {
    return {
        type: actionTypes.SET_ESTADO_NOTIFICACIONES,
        data
    }
}

export const setRespuestaNotificaciones = (data) => {
    return {
        type: actionTypes.SET_RESPUESTA_NOTIFICACIONES,
        data
    }
}