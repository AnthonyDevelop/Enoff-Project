import { actionTypes } from "../../Constantes/ActionTypes"

export const setGuardarVideo = (data) => {
    return {
        type: actionTypes.SET_GUARDAR_VIDEO,
        data
    }
}