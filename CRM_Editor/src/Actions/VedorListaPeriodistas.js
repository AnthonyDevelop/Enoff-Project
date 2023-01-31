import { actionTypes } from "../Constantes/ActionTypes"; 

export const getListaPeriodistas = (data) => {
    return {
        type: actionTypes.GET_LISTA_PERIODISTA,
        data
    }
}

export const setListaPeriodistas = (data) => {
    return {
        type: actionTypes.SET_LISTA_PERIODISTA,
        data
    }
}
