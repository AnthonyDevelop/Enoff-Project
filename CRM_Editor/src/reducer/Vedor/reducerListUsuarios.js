import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListUsuario (state = store.listUsuarios, action){
    switch(action.type){
        case actionTypes.SET_LISTA_USUARIOS:
            let listUsers = action.data
            return Object.assign({}, state, {
                data: listUsers,
            })
            default:
                return state
    }
}

export default reducerListUsuario;