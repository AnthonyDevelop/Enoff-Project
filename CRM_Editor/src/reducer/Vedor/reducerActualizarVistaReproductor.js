import { actionTypes } from "../../Constantes/ActionTypes";
import { store } from "../../Store/index";

function reducerActualizarVistaReproductor (state = store.actualizarVistaReproductor, action){
    switch(action.type){
        case actionTypes.SET_REPRODUCTOR_VIDEO_ACTUALIZAR_VISTA:
            let actuarlizarVistaData = action.data
            return Object.assign({}, state, {
                data: actuarlizarVistaData,
            })
            default:
                return state
    }
}

export default reducerActualizarVistaReproductor;