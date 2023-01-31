import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAvanzarVideoPostCompra (state = store.avanzarVideoPostCompra, action){
    switch(action.type){
        case actionTypes.AVANZAR_VIDEO_POST_COMPRA:
            let avanzarVideoPostCompra = action.data
            return Object.assign({}, state, {
                data: avanzarVideoPostCompra,
            })
            default:
                return state
    }
}

export default reducerAvanzarVideoPostCompra;