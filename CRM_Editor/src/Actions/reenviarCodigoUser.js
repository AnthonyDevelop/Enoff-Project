import { actionTypes } from "../Constantes/ActionTypes"; 

export const reenviarCodigoUser = (data) => {
    return {
        type: actionTypes.REENVIAR_CODIGO_USER,
        data
    }
}

export const respuestaReenviarCodigoUser = (data) => {
    return {
        type: actionTypes.RESPUESTA_REENVIAR_CODIGO,
        data
    }
}