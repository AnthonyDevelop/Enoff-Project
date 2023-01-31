import { actionTypes } from "../Constantes/ActionTypes"; 

export const validarRegistro = (data) => {
    return {
        type: actionTypes.USER_VALIDAR_REGISTRO,
        data
    }
}