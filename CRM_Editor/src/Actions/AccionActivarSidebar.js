import { actionTypes } from "../Constantes/ActionTypes"; 

export const ActivarSeccionSidebar = (data) => {
    return {
        type: actionTypes.ACTIVAR_SECCION_SIDEBAR,
        data
    }
}