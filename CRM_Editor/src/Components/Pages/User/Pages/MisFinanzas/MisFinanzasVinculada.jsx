import React from 'react'

export default function MisFinanzasVinculada() {
  
  
    return (
    
    
    <>
    <div className='containerFinanzas'>
        <h1>Mis finanzas</h1>
        <div className='containerBorder'>
          <div style={{height: "100%"}} className='containerBilleteraVirtual-2'>
            <h2>Billetera vinculada</h2>
            <div className='containerDatos'>
                <p>Nombre</p><span>Valentin</span>
            </div>
            <div className='containerDatos'>
                <p>Apellido</p><span>Tixeira</span>
            </div>
            <div className='containerDatos'>
                <p>CBU/CVU</p><span>99999999999</span>
            </div>
            <div className='containerDatos'>
                <p>ALIAS</p><span>tu.vieja.sape</span>
            </div>
            <div className='containerDatos'>
                <p>DNI</p><span>40004150</span>
            </div>
          </div>
          <div className='containerOptions'>
            <div className='optionsFinanza'>
                <p className='mobile-desactivado'>Modificar billetera vinculada</p>
                <p>Desvincular billetera</p>
            </div>
            <button className='mobile-desactivado'>Volver</button>
          </div>
        </div>
    </div>
    </>
  )
}
