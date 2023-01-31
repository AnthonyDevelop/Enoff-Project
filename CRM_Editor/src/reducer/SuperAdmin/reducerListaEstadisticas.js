import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListaEstadisticas (state = store.estadisticas, action){
    switch(action.type){
        case actionTypes.SET_LISTA_ESTADISTICAS:
            let listaDeEstadisticas = action.data
            return Object.assign({}, state, {
                data: listaDeEstadisticas,
            })
            default:
                return state
    }
}

export default reducerListaEstadisticas;