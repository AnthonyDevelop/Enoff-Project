import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerSumarStrike (state = store.actualizacionStrikes, action){
    switch(action.type){
        case actionTypes.SET_SUMAR_STRIKE:
            let sumarStrike = action.data
            return Object.assign({}, state, {
                data: sumarStrike,
            })
            default:
                return state
    }
}

export default reducerSumarStrike;