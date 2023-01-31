import { actionTypes } from "../../Constantes/ActionTypes";

export const getUserUtilizoFiltros = (data) => {
    return {
        type: actionTypes.GET_USER_UTILIZO_FILTROS,
        data
    }
}