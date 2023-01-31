import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerCategorias (state = store.categorias, action){
    switch(action.type){
        case actionTypes.SET_ALL_CATEGORIAS:
            let listCategorias = action.data
            return Object.assign({}, state, {
                data: listCategorias,
            })
            default:
                return state
    }
}

export default reducerCategorias;