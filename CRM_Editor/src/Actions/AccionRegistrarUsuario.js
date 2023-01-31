import { actionTypes } from "../Constantes/ActionTypes"; 

export const getRegirarUsuario = (data) => {
    return {
        type: actionTypes.GET_REGISTRAR_USUARIO,
        data
    }
}

export const setRegistrarUsuario = (data) => {
    return {
        type: actionTypes.SET_REGISTRAR_USUARIO,
        data
    }
}