import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerAdminRecibirVideosDestacados (state = store.adminVideosDestacados, action){
    switch(action.type){
        case actionTypes.SET_ADMIN_RECIBIR_VIDEOS_DESTACADOS:
            let videosDestacadosAdminData = action.data
            return Object.assign({}, state, {
                data: videosDestacadosAdminData,
            })
            default:
                return state
    }
}

export default reducerAdminRecibirVideosDestacados;