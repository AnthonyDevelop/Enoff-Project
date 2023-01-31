import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerListaVeedores (state = store.listaVeedores, action){
    switch(action.type){
        case actionTypes.SET_LISTA_VEEDORES:
            let listaDeVeedores = action.data
            return Object.assign({}, state, {
                data: listaDeVeedores,
            })
            default:
                return state
    }
}

export default reducerListaVeedores;