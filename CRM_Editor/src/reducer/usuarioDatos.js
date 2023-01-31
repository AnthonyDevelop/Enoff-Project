import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerUsuarioDatos (state = store.dataUsuario, action){
    switch(action.type){
        case actionTypes.SET_USUARIO_DATA:
            let UsuarioData = action.data
            return Object.assign({}, state, {
                data: UsuarioData,
            })
            default:
                return state
    }
}

export default reducerUsuarioDatos;