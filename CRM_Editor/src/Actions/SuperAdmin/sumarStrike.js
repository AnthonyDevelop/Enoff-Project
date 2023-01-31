import { actionTypes } from "../../Constantes/ActionTypes";

export const getSumarStrike = (data) => {
    return {
        type: actionTypes.GET_SUMAR_STRIKE,
        data
    }
}

export const setSumarStrike = (data) => {
    return {
        type: actionTypes.SET_SUMAR_STRIKE,
        data
    }
}