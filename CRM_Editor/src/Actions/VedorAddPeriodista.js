import { actionTypes } from "../Constantes/ActionTypes"; 

export const setAddPeriodista = (data) => {
    return {
        type: actionTypes.VEDOR_AGREGAR_PERIODISTA,
        data
    }
}

export const setRespuestaPeriodista = (data) => {
    return {
        type: actionTypes.SET_RESPUESTA_PERIODISTA,
        data
    }
}