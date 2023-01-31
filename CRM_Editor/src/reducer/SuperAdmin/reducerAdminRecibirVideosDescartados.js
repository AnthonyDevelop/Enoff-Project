import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAdminRecibirVideosDescartados (state = store.adminVideosDescartados, action){
    switch(action.type){
        case actionTypes.SET_ADMIN_RECIBIR_VIDEOS_DESCARTADOS:
            let videosDescartadosAdminData = action.data
            return Object.assign({}, state, {
                data: videosDescartadosAdminData,
            })
            default:
                return state
    }
}

export default reducerAdminRecibirVideosDescartados;