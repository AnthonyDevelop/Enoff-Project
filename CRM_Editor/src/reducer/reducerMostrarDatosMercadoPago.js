import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerMostrarDatosMercadoPago (state = store.datosMercadoPago, action){
    switch(action.type){
        case actionTypes.SET_MERCADOPAGO_DATA:
            let MercadoPagoData = action.data
            return Object.assign({}, state, {
                data: MercadoPagoData,
            })
            default:
                return state
    }
}

export default reducerMostrarDatosMercadoPago;