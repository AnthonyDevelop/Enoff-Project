import { actionTypes } from "../Constantes/ActionTypes"; 

export const getDatosUsuario = (data) => {
    return {
        type: actionTypes.GET_USUARIO_DATA,
        data
    }
}

export const setDatosUsuario = (data) => {
    return {
        type: actionTypes.SET_USUARIO_DATA,
        data
    }
}