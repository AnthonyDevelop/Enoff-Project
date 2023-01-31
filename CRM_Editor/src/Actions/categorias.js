import { actionTypes } from "../Constantes/ActionTypes"; 

export const getCategorias = (data) => {
    return {
        type: actionTypes.GET_ALL_CATEGORIAS,
        data
    }
}

export const setCategorias = (data) => {
    return {
        type: actionTypes.SET_ALL_CATEGORIAS,
        data
    }
}