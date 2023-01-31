import { actionTypes } from "../Constantes/ActionTypes"; 



export const setEnviarVideo = (data) => {
    return {
        type: actionTypes.SET_ENVIAR_VIDEO,
        data
    }
}