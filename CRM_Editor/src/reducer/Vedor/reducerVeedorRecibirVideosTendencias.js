import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideosTendencias (state = store.veedorVideosTendencias, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS_TENDENCIAS:
            let veedorVideosTendenciasData = action.data
            return Object.assign({}, state, {
                data: veedorVideosTendenciasData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideosTendencias;