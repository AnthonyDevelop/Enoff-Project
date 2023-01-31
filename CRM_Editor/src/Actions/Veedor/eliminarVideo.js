import { actionTypes } from "../../Constantes/ActionTypes"

export const setEliminarVideo = (data) => {
    return {
        type: actionTypes.SET_ELIMINAR_VIDEO,
        data
    }
}

