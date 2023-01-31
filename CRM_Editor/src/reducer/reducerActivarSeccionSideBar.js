import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerActivarSeccionSideBar (state = store.activarSeccionSideBar, action){
    switch(action.type){
        case actionTypes.ACTIVAR_SECCION_SIDEBAR:
            let pintarButton = action.data
            return Object.assign({}, state, {
                data: pintarButton,
            })  
            default:
                return state
    }
}

export default reducerActivarSeccionSideBar;