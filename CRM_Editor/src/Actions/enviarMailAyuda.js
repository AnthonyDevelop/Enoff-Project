import { actionTypes } from "../Constantes/ActionTypes"; 

export const enviarMailAyuda = (data) => {
    return {
        type: actionTypes.ENVIAR_MAIL_AYUDA,
        data
    }
}