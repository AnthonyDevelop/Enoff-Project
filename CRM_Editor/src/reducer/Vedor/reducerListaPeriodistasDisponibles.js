import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListPeriodistasDisponibles (state = store.listPeriodistaDisponibles, action){
    switch(action.type){
        case actionTypes.SET_LISTA_PERIODISTA_DISPONIBLES:
            let listPeriodistasDispo = action.data
            return Object.assign({}, state, {
                data: listPeriodistasDispo,
            })
            default:
                return state
    }
}

export default reducerListPeriodistasDisponibles;