import { actionTypes } from "../Constantes/ActionTypes"; 

export const getListaUsuarios = (data) => {
    return {
        type: actionTypes.GET_LISTA_USUARIOS,
        data
    }
}

export const setListaUsuarios = (data) => {
    return {
        type: actionTypes.SET_LISTA_USUARIOS,
        data
    }
}
