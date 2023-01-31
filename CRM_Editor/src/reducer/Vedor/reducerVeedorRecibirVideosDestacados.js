import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideosDestacados (state = store.veedorVideosDestacados, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS_DESTACADOS:
            let veedorVideosDestacadosData = action.data
            return Object.assign({}, state, {
                data: veedorVideosDestacadosData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideosDestacados;