import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideosComprados (state = store.veedorVideosComprados, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS_COMPRADOS:
            let veedorVideosCompradosData = action.data
            return Object.assign({}, state, {
                data: veedorVideosCompradosData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideosComprados;