import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideos (state = store.veedorVideos, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS:
            let veedorVideosData = action.data
            return Object.assign({}, state, {
                data: veedorVideosData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideos;