import { actionTypes } from "../../Constantes/ActionTypes"

export const setEliminarPeriodista = (data) => {
    return {
        type: actionTypes.SET_ELIMINAR_PERIODISTA,
        data
    }
}

export const actualizarPeriodistasEliminados = (data) => {
    return {
        type: actionTypes.ACTUALIZAR_ELIMINAR_PERIODISTA,
        data
    }
}

