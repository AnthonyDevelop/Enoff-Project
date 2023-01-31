import { actionTypes } from "../../Constantes/ActionTypes";

export const getListaVeedores = (data) => {
    return {
        type: actionTypes.GET_LISTA_VEEDORES,
        data
    }
}

export const setListaVeedores = (data) => {
    return {
        type: actionTypes.SET_LISTA_VEEDORES,
        data
    }
}