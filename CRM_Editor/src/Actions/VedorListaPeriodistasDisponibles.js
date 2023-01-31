import { actionTypes } from "../Constantes/ActionTypes"; 

export const getListaPeriodistasDisponibles = (data) => {
    return {
        type: actionTypes.GET_LISTA_PERIODISTA_DISPONIBLES,
        data
    }
}

export const setListaPeriodistasDisponibles = (data) => {
    return {
        type: actionTypes.SET_LISTA_PERIODISTA_DISPONIBLES,
        data
    }
}
