import { actionTypes } from "../../Constantes/ActionTypes"

export const enviarMailPeriodista = (data) => {
    return {
        type: actionTypes.ENVIAR_MAIL_PERIODISTA,
        data
    }
}


export const respuestaMailPeriodista = (data) => {
    return {
        type: actionTypes.RESPUESTA_MAIL_PERIODISTA,
        data
    }
}

