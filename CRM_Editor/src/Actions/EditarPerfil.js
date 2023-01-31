import { actionTypes } from "../Constantes/ActionTypes"; 

export const editarPerfilUsuario = (data) => {
    return {
        type: actionTypes.EDITAR_USUARIO_PERFIL,
        data
    }
}

export const respuestaEditarPerfilUsuario = (data) => {
    return {
        type: actionTypes.RESPUESTA_EDITAR_USUARIO_PERFIL,
        data
    }
}