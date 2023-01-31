import axios from 'axios';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./mercadopago.css"

function MercadoPagoApi() {
    const location = useLocation();
    const { from } = location.state;
    let mp = "";

    useEffect(()=>{
    if(from!=null){
        mp = new window.MercadoPago(from.public_key);
    }
},[mp])

    useEffect(()=>{
        if(from!=null && mp!=""){
        const cardForm = mp.cardForm({
            amount: String(from.precio),
            iframe: true,
            form: {
            id: "form-checkout",
            cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Numero de tarjeta",
                
            },
            expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/YY",
            },
            securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "Código de seguridad",
            },
            cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Titular de la tarjeta",
            },
            issuer: {
                id: "form-checkout__issuer",
                placeholder: "Banco emisor",
            },
            installments: {
                id: "form-checkout__installments",
                placeholder: "Cuotas",
            },        
            identificationType: {
                id: "form-checkout__identificationType",
                placeholder: "Tipo de documento",
            },
            identificationNumber: {
                id: "form-checkout__identificationNumber",
                placeholder: "Número del documento",
            },
            cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "E-mail",
            },
            },
            callbacks: {
            onFormMounted: error => {
                if (error) return console.warn("Form Mounted handling error: ", error);
                console.log("Form mounted");
            },
            onSubmit: event => {
                event.preventDefault();

                const {
                paymentMethodId: payment_method_id,
                issuerId: issuer_id,
                cardholderEmail: email,
                amount,
                token,
                installments,
                identificationNumber,
                identificationType,
                } = cardForm.getCardFormData();

                fetch("https://enoff.com.ar/server/public/api/comprarPostVedor", {
                method: "POST",
                headers: {
                    Authorization: `Bearer `+ localStorage.getItem('token'),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comentario:from.comentarios,
                    calificacion:from.calificacion,
                    id: from.idPublicacion,
                    token,
                    issuer_id,
                    payment_method_id,
                    transaction_amount: Number(amount),
                    installments: Number(installments),
                    description: "Descripción del producto",
                    payer: {
                    email,
                    identification: {
                        type: identificationType,
                        number: identificationNumber,
                    },
                    },
                }),
                });
            } },
        });
    }
      },[mp,from])

    return(
        <>
        <form id="form-checkout">
            <div id="form-checkout__cardNumber" class="container"></div>
            <div id="form-checkout__expirationDate" class="container"></div>
            <div id="form-checkout__securityCode" class="container"></div>
            <input type="text" id="form-checkout__cardholderName" />
            <select id="form-checkout__issuer"></select>
            <select id="form-checkout__installments"></select>
            <select id="form-checkout__identificationType"></select>
            <input type="text" id="form-checkout__identificationNumber" />
            <input type="email" id="form-checkout__cardholderEmail" />
            <button type="submit" id="form-checkout__submit">Pagar</button>
        </form>
        </>
    );
}

export default MercadoPagoApi;