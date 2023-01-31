import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerMostrarVideosPorUsuario (state = store.videosPorUsuario, action){
    switch(action.type){
        case actionTypes.SET_VIDEOS_POR_USUARIO:
            let UsuarioDataPorVideo = action.data
            return Object.assign({}, state, {
                data: UsuarioDataPorVideo,
            })
            default:
                return state
    }
}

export default reducerMostrarVideosPorUsuario;