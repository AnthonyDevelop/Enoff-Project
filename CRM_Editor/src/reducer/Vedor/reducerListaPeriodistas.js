import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListPeriodistas (state = store.listPeriodista, action){
    switch(action.type){
        case actionTypes.SET_LISTA_PERIODISTA:
            let listPeriodistas = action.data
            return Object.assign({}, state, {
                data: listPeriodistas,
            })
            default:
                return state
    }
}

export default reducerListPeriodistas;