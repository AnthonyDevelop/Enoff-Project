import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAdminRecibirVideosComprados (state = store.adminVideosComprados, action){
    switch(action.type){
        case actionTypes.SET_ADMIN_RECIBIR_VIDEOS_COMPRADOS:
            let videosCompradosAdminData = action.data
            return Object.assign({}, state, {
                data: videosCompradosAdminData,
            })
            default:
                return state
    }
}

export default reducerAdminRecibirVideosComprados;