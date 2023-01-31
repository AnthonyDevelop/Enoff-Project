import { actionTypes } from '../Constantes/ActionTypes'
import { store } from '../Store'

export default function reducerEditarPerfilUsuario(state = store.respuestaEditarPerfil, action) {

    switch (action.type) {
            case actionTypes.RESPUESTA_EDITAR_USUARIO_PERFIL:
            let respuestaPerfilData = action.data
            return Object.assign({}, state, {
                data: respuestaPerfilData,
            })
        default:
            return state
    }
}
