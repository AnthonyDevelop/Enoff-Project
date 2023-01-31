import { actionTypes } from "../Constantes/ActionTypes"; 

export const setDeletePeriodista = (data) => {
    return {
        type: actionTypes.DELETE_PERIODISTA,
        data
    }
}