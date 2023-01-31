import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerRespuestaAddPeriodista (state = store.respuestaAddPeriodista, action){
    switch(action.type){
        case actionTypes.SET_RESPUESTA_PERIODISTA:
            let respuestaAddPeriodistaData = action.data
            return Object.assign({}, state, {
                data: respuestaAddPeriodistaData,
            })
            default:
                return state
    }
}

export default reducerRespuestaAddPeriodista;

