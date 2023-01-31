import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerMostrarMisVideos (state = store.misVideos, action){
    switch(action.type){
        case actionTypes.SET_RECIBIR_MISVIDEOS:
            let UsuarioData = action.data
            return Object.assign({}, state, {
                data: UsuarioData,
            })
            default:
                return state
    }
}

export default reducerMostrarMisVideos;