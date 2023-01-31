import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAdminRecibirVideosGuardados (state = store.adminVideosGuardados, action){
    switch(action.type){
        case actionTypes.SET_ADMIN_RECIBIR_VIDEOS_GUARDADOS:
            let videosGuardadosAdminData = action.data
            return Object.assign({}, state, {
                data: videosGuardadosAdminData,
            })
            default:
                return state
    }
}

export default reducerAdminRecibirVideosGuardados;