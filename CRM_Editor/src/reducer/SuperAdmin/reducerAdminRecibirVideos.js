import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAdminRecibirVideos (state = store.adminVideos, action){
    switch(action.type){
        case actionTypes.SET_ADMIN_RECIBIR_VIDEOS:
            let videosAdminData = action.data
            return Object.assign({}, state, {
                data: videosAdminData,
            })
            default:
                return state
    }
}

export default reducerAdminRecibirVideos;