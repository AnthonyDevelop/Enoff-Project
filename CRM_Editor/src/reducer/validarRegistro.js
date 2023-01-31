import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerValidarRegistro (state = store.validarRegistro, action){
    switch(action.type){
        case actionTypes.USER_VALIDAR_REGISTRO:
            let validarRegistroData = action.data
            return Object.assign({}, state, {
                data: validarRegistroData,
            })
            default:
                return state
    }
}

export default reducerValidarRegistro;