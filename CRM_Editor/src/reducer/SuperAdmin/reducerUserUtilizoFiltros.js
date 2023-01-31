import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerUserUtilizoFiltros (state = store.userUtilizoFiltros, action){
    switch(action.type){
        case actionTypes.GET_USER_UTILIZO_FILTROS:
            let utilizoFiltrosData = action.data
            return Object.assign({}, state, {
                data: utilizoFiltrosData,
            })
            default:
                return state
    }
}

export default reducerUserUtilizoFiltros;