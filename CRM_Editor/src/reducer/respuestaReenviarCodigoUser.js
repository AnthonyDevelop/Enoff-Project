import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerRespuestaReenviarCodigo (state = store.respuestaReenviarCodigoUser, action){
    switch(action.type){
        case actionTypes.RESPUESTA_REENVIAR_CODIGO:
            let respuestaReenviarCodigoData = action.data
            return Object.assign({}, state, {
                data: respuestaReenviarCodigoData,
            })
            default:
                return state
    }
}

export default reducerRespuestaReenviarCodigo;