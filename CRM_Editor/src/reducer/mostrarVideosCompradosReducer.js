import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerVideosComprados (state = store.videosComprados, action){
    switch(action.type){
        case actionTypes.SET_VIDEOS_COMPRADOS:
            let videosUserComprados = action.data
            return Object.assign({}, state, {
                data: videosUserComprados,
            })
            default:
                return state
    }
}

export default reducerVideosComprados;