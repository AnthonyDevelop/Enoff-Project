import { actionTypes } from '../Constantes/ActionTypes'
import { store } from '../Store'

export default function reducerCredencialMercadoPago(state = store.credencialMercadoPago, action) {

    switch (action.type) {
            case actionTypes.SET_RECIBIR_CREDENCIALES_MP:
            let credencialesMP = action.data
            return Object.assign({}, state, {
                data: credencialesMP,
            })
        default:
            return state
    }
}
