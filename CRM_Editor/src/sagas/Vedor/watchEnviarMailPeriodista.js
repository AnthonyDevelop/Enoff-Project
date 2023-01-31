import { actionTypes } from "../../Constantes/ActionTypes";
import { takeEvery, call,put  } from'redux-saga/effects';
import enviarMailPeriodista from "../../api/Vedor/enviarMailPeriodistas";
import { respuestaMailPeriodista } from "../../Actions/Veedor/enviarMailPeriodista";

export const watchEnviarMailPeriodista= function * (){
    yield takeEvery(actionTypes.ENVIAR_MAIL_PERIODISTA, fetchEnviarMailPeriodista)
}

function* fetchEnviarMailPeriodista(action){
    try{
        const data = yield call(enviarMailPeriodista, action.data)
        if(data){
            yield put(respuestaMailPeriodista(data))   
        }
    }catch(err){
        console.log(err)

    }
}