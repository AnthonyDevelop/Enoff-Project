import axios from "axios";

const baseUrl= 'https://apis.datos.gob.ar/georef/api/provincias';
// const apiKey = '';

export const GeoGobierno = async () => {
    try{
        const {data} = await axios.get(baseUrl 
            // + `q=${cityname}`
            );
        return data;
        console.log(data)
    }catch(error){
        throw error;
    }
}


// const apiKey = '';

export const GeoGobiernoLocalidades = async (cityname) => {
    const baseUrl2= `https://apis.datos.gob.ar/georef/api/localidades?provincia=${cityname}&campos=nombre&max=5000`;
    try{
        const {data} = await axios.get(baseUrl2);
        return data;
        // console.log(dataLocalidad)
    }catch(error){
        throw error;
    }
}