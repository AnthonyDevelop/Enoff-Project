import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerRespuestaMailPeriodista (state = store.respuestaMailPeriodista, action){
    switch(action.type){
        case actionTypes.RESPUESTA_MAIL_PERIODISTA:
            let respuestaMailPeriodista = action.data
            return Object.assign({}, state, {
                data: respuestaMailPeriodista,
            })
            default:
                return state
    }
}

export default reducerRespuestaMailPeriodista;

