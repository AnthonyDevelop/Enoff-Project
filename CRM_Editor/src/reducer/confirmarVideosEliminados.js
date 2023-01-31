import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerConfirmarVideosEliminados (state = store.confirmarVideosEliminados, action){
    switch(action.type){
        case actionTypes.CONFIRMAR_VIDEOS_ELIMINADOS:
            let confirmarVideosEliminadosData = action.data
            return Object.assign({}, state, {
                data: confirmarVideosEliminadosData,
            })
            default:
                return state
    }
}

export default reducerConfirmarVideosEliminados;