import { actionTypes } from "../Constantes/ActionTypes";
import { store } from "../Store/index";

function reducerLogin(state = store.login, action) {
    switch (action.type) {
      case actionTypes.RESULT_VERIFICAR_LOGIN:

        //const respuesta = JSON.stringify(action.data.token);
        localStorage.setItem('token',action.data.token);

        return Object.assign({}, state, {
            user_data:  action.data.token != null,
        }) 
        default:
          return state;
    }
  }

  export default reducerLogin;