import React, { useEffect ,useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { getRecibirCredenciales, setRecibirCredenciales } from '../../../Actions/AccionCredencialMercadoPago';


function MercadoPagoCredencial() {
  const dispatch = useDispatch();
  const valoresURL = window.location.search;
  const urlParams = new URLSearchParams(valoresURL);
  const [codeEstado, setCodeEstado] = useState(
    {
      code:"",
    }
  );

  const codigoMp = useMemo(() => {   
      setCodeEstado({code:urlParams.get('code')});     
   
  }, []);


  
    return (
    <div>
      <hr/><p style={{color:'#DA643A'}}>Vinculado correctamente!</p></div> 
  )
}

export default MercadoPagoCredencial