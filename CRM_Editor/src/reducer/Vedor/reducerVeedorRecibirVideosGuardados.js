import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerVeedorRecibirVideosGuardados (state = store.veedorVideosGuardados, action){
    switch(action.type){
        case actionTypes.SET_VEEDOR_RECIBIR_VIDEOS_GUARDADOS:
            let veedorVideosGuardadosData = action.data
            return Object.assign({}, state, {
                data: veedorVideosGuardadosData,
            })
            default:
                return state
    }
}

export default reducerVeedorRecibirVideosGuardados;