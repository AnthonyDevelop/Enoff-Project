import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListaUsuariosConVideos (state = store.listaUsuariosConVideos, action){
    switch(action.type){
        case actionTypes.SET_LISTA_USERS_CON_VIDEOS:
            let listUserConVideosData = action.data
            return Object.assign({}, state, {
                data: listUserConVideosData,
            })
            default:
                return state
    }
}

export default reducerListaUsuariosConVideos;