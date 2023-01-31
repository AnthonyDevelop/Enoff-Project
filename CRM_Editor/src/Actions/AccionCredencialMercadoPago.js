import { actionTypes } from "../Constantes/ActionTypes"

export const getRecibirCredenciales = (data) => {
    return {
        type: actionTypes.GET_RECIBIR_CREDENCIALES_MP,
        data
    }
}

export const setRecibirCredenciales = (data) => {
    return {
        type: actionTypes.SET_RECIBIR_CREDENCIALES_MP,
        data
    }
}
export const setEliminarCredencialMP = (data) => {
    return {
        type: actionTypes.ELIMINAR_CREDENCIALES_MP,
        data
    }
}