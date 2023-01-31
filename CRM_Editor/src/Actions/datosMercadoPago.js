import { actionTypes } from "../Constantes/ActionTypes"; 

export const getDatosMercadoPago = (data) => {
    return {
        type: actionTypes.GET_MERCADOPAGO_DATA,
        data
    }
}

export const setDatosMercadoPago = (data) => {
    return {
        type: actionTypes.SET_MERCADOPAGO_DATA,
        data
    }
}