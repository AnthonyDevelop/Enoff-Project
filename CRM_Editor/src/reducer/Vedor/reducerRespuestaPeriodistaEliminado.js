
import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerRespuestaPeriodistaEliminado (state = store.respuestaPeriodistaEliminado, action){
    switch(action.type){
        case actionTypes.ACTUALIZAR_ELIMINAR_PERIODISTA:
            let respPeriodistaEliminado = action.data
            return Object.assign({}, state, {
                data: respPeriodistaEliminado,
            })
            default:
                return state
    }
}

export default reducerRespuestaPeriodistaEliminado;

