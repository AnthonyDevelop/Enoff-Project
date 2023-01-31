import { actionTypes } from "../../Constantes/ActionTypes";

export const getListaEstadisticas = (data) => {
    return {
        type: actionTypes.GET_LISTA_ESTADISTICAS,
        data
    }
}

export const setListaEstadisticas = (data) => {
    return {
        type: actionTypes.SET_LISTA_ESTADISTICAS,
        data
    }
}