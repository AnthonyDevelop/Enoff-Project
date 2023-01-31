import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';

//Styles
import "./terminosYCondiciones.css"

export default function TerminosYCondiciones(props) {
    const modalEstado = props.abrirModalTerms;
    const [open, setOpen] = useState(modalEstado!=null);
    const handleClose = () => setOpen(null);

    useEffect(()=>{
        if(modalEstado != null  ){
          setOpen(modalEstado);
        }
      },[modalEstado]);

  return (
    <>
    {(open) &&
    <Modal className='modal-terms' show={modalEstado} size="lg" backdrop="static" centered>
        <Modal.Header className='modal-terms-titulo'>
          <Modal.Title>Términos y Condiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body className="contentAllPolity">

            <h3>INTRODUCCIÓN</h3>
            <span className="font-terminos">
              Los Presentes Términos y Condiciones Generales son aplicables al
              uso, contenido y servicios ofrecidos por EN OFF empresa parte de
              GRUPO DELSUD ADMINISTRACION FINANCIERA E INMOBILIARIA S.R.L., CUIT
              30-71616529-5, en el sitio web www.enoff.com.ar y/o en las
              aplicaciones (apps) vinculadas, denominados colectivamente, la
              Plataforma. Cualquier persona que ingrese y/o utilice el sitio o
              los servicios podrá hacerlo sujeto a los Términos y Condiciones
              Generales aquí señalados, junto con todas las demás políticas y
              principios que rigen la Plataforma y que son incorporados al
              presente por referencia. CUALQUIER PERSONA QUE NO ACEPTE ESTOS
              TÉRMINOS Y CONDICIONES GENERALES, LOS CUALES TIENEN UN CARÁCTER
              OBLIGATORIO Y VINCULANTE, DEBERÁ ABSTENERSE DE UTILIZAR LA
              PLATAFORMA ENOFF Y/O LOS SERVICIOS DE ENOFF. El Usuario debe leer,
              entender y aceptar todas las condiciones establecidas en los
              Términos y Condiciones Generales previo a su registración como
              Usuario de EN OFF, optando de forma expresa por recibir los mismos
              y toda otra información por medios digitales. Asimismo, mantenemos
              otros términos y políticas que complementan los presentes, como
              las Políticas de Privacidad y Uso de Datos, que describe la
              recopilación y el uso de datos personales, y los Términos de Pago,
              que rigen las condiciones, tarifas y servicios de pago a los
              Usuarios registrados por el material utilizado por EN OFF.
            </span>
            <h3>SERVICIOS DE LA PLATAFORMA</h3>
            <span className="font-terminos">
              La Plataforma ENOFF ofrece un sitio en línea que permite a sus
              usuarios registrados subir, ceder u ofrecer contenido o material
              inédito, y/o de interés masivo o público, para la posterior
              publicación y/o difusión de dicho material a través de medios
              periodísticos en todo el territorio de la República Argentina. Los
              Usuarios registrados que utilicen la plataforma para subir, ceder
              y/u ofrecer el contenido o material periodístico propio, autorizan
              expresamente a EN OFF y sus empresas asociadas a utilizar,
              publicar, reproducir y/o adaptar el contenido o material de
              acuerdo a la exclusiva evaluación que ésta haga del mismo. La
              plataforma abonará al usuario, un monto de dinero fijado por la
              misma en los Términos de Pago, siempre que el material SEA
              UTILIZADO, PUBLICADO O REPRODUCIDO a través de sus medios
              periodísticos afines. Todo otro material subido, cedido u ofrecido
              a la plataforma por parte del usuario que NO sea utilizado,
              publicado o reproducido por ésta y/o sus medios afines, NO
              generará obligaciones ni dará derecho bajo ningún concepto a
              exigir pago, remuneración y/o indemnización de cualquier tipo y/o
              índole a ninguna de las partes. En Off NO es empleador, ni
              funciona como intermediario y/o como agente y/o representante de
              ningún Usuario registrado en su website.
            </span>
            <h3>UTILIZACION DE LA PLATAFORMA</h3>
            <span className="font-terminos">
              El Usuario se obliga a abstenerse de utilizar el Sitio Web y/o los
              Servicios con fines o efectos ilícitos, contrarios a lo
              establecido en estos Términos y Condiciones, nuestras Políticas de
              Privacidad y Uso de Datos y/o la legislación vigente, lesivos de
              los derechos e intereses de terceros, incluyendo clientes de EN
              OFF, o que de cualquier forma puedan dañar, inutilizar,
              sobrecargar o deteriorar la Plataforma/Sitio Web o impedir la
              normal utilización del Sitio Web por parte de los diferentes
              usuarios. La autenticidad, integridad y veracidad de TODO el
              material o contenido subido, cedido u ofrecido a la plataforma por
              parte de un usuario registrado es responsabilidad exclusiva de
              éste, quién asume expresamente todas las obligaciones
              contractuales y extracontractuales que pudieren surgir por el uso,
              difusión y/o publicación de dicho material, dejando indemne de
              cualquier responsabilidad directa o indirecta frente a terceros a
              EN OFF.
            </span>
            <h3>CONTENIDOS DE LA PLATAFORMA</h3>
            <span className="font-terminos">
              Los contenidos de la Plataforma/Sitio Web, tales como texto,
              información, gráficos, imágenes, logos, marcas, software, bases de
              datos, diseños, arquitectura funcional y cualquier otro material
              (en adelante, el “Contenido"), están protegidos por las leyes
              aplicables, incluyendo, pero sin limitación, las leyes sobre
              derechos de autor, patentes, marcas, modelos de utilidad, diseños
              industriales y nombres de dominio. Todo el Contenido es propiedad
              de EN OFF y/o de las sociedades vinculadas y/o de sus proveedores
              de contenido. La compilación, interconexión, operatividad y
              disposición de los Contenidos del Sitio Web es de propiedad
              exclusiva de EN OFF y/o de sus empresas vinculadas. El uso,
              adaptación, reproducción y/o comercialización no autorizada del
              contenido puede encontrarse penado por la legislación aplicable.
              Los Usuarios no deberán copiar ni adaptar el código de
              programación desarrollado por, o por cuenta de, EN OFF, bajo
              ningún concepto, salvo expresa autorización previa y por escrito
              de EN OFF a tal efecto.
            </span>
            <h3>REGISTRACION</h3>
            <span className="font-terminos">
              Para ser usuario registrado es necesario crear una cuenta en el
              sitio web EN OFF, siendo obligatorio completar el formulario de
              registración en todos sus campos con datos válidos para poder
              utilizar los servicios ofrecidos. El futuro Usuario deberá
              completarlo con su información personal de manera exacta, precisa
              y verdadera, asumiendo el compromiso de actualizar los datos
              personales conforme resulte necesario. El Usuario presta expresa
              conformidad para que la Plataforma EN OFF utilice diversos medios
              para identificar sus datos personales, asumiendo el Usuario la
              obligación de revisarlos y mantenerlos actualizados. La Plataforma
              EN OFF NO se responsabiliza por la certeza de los datos personales
              de los Usuarios, ni del contenido o la información ofrecida o
              consignada, ya que éstos garantizan y responden, en cualquier
              caso, por la veracidad, exactitud, vigencia y autenticidad de los
              mismos. La Plataforma EN OFF se reserva el derecho de solicitar
              documentación y/o datos adicionales a efectos de corroborar los
              datos personales, así como de suspender temporal o definitivamente
              a aquellos usuarios cuyos datos y/u información o contenidos
              ofrecidos no puedan ser confirmados y/o verificados. En estos
              casos de inhabilitación, se rescindirán todos los contratos
              suscriptos, así como las ofertas/reservas realizadas, sin que ello
              genere algún derecho a resarcimiento para el usuario inhabilitado.
              El Usuario accederá a su cuenta personal ("Cuenta") mediante el
              ingreso de su nombre y clave de seguridad personal elegida ("Clave
              de Seguridad"). El Usuario se obliga a mantener la
              confidencialidad de su Clave de Seguridad. La Plataforma EN OFF se
              reserva el derecho de rechazar cualquier solicitud de registración
              o de cancelar una registración previamente aceptada, sin que esté
              obligado a comunicar o exponer las razones de su decisión y sin
              que ello genere algún derecho a indemnización o resarcimiento.
            </span>
            <h3>LA CUENTA</h3>
            <span className="font-terminos">
              La Cuenta es personal, única e intransferible, y está prohibido
              que un mismo usuario registre o posea más de una Cuenta. En caso
              de que la Plataforma En Off detecte distintas cuentas que
              contengan datos coincidentes o relacionados, podrá cancelar,
              suspender o inhabilitar una o todas ellas a su exclusivo arbitrio.
              El usuario será responsable por todas las operaciones efectuadas
              en su Cuenta, incluido TODO el material que suba y/u ofrezca a
              través de la misma, pues el acceso está restringido al uso de su
              Clave de Seguridad, de conocimiento exclusivo del Usuario. El
              Usuario se compromete a notificar a la Plataforma en forma
              inmediata y por medio idóneo y fehaciente, cualquier uso no
              autorizado de su Cuenta, así como el ingreso por terceros no
              autorizados a la misma. Se aclara que está prohibida la venta,
              cesión o transferencia de la Cuenta bajo cualquier título.
            </span>
            <h3>CAPACIDAD DE CONTRATACION</h3>
            <span className="font-terminos">
              Los servicios sólo están disponibles para personas que tengan
              capacidad legal para contratar de acuerdo a la legislación
              argentina. No podrán utilizar los servicios las personas que no
              tengan esa capacidad, los menores de edad o Usuarios que hayan
              sido suspendidos temporalmente o inhabilitados definitivamente. Si
              un usuario se registra como Empresa, debe tener capacidad para
              contratar a nombre de tal entidad y de obligar a la misma en los
              términos de este Acuerdo.
            </span>
            <h3>MODIFICACIONES DE TERMINOS Y CONDICIONES</h3>
            <span className="font-terminos">
              En Off podrá modificar los Términos y Condiciones Generales en
              cualquier momento haciendo públicos en la Plataforma En Off los
              términos modificados. Todos los términos modificados entrarán en
              vigor a partir del momento de su publicación. Los cambios
              realizados no afectarán las relaciones y/o contratos vigentes a la
              fecha de la modificación. Todo usuario que no esté de acuerdo con
              las modificaciones efectuadas por En Off podrá solicitar la baja
              de la cuenta. El uso de la Plataforma En Off y/o sus servicios
              implica la aceptación de estos Términos y Condiciones Generales.
            </span>
            <h3>PRIVACIDAD DE LA INFORMACIÓN</h3>
            <span className="font-terminos">
              Para utilizar los Servicios ofrecidos por En Off, los Usuarios
              deberán facilitar determinada información y datos de carácter
              personal. Su información personal se procesa y almacena en
              servidores o medios magnéticos que mantienen altos estándares de
              seguridad y protección tanto física como tecnológica. Para mayor
              información sobre la privacidad de los Datos Personales y casos en
              los que será revelada la información personal, se pueden consultar
              nuestras Políticas de Privacidad y Uso de Datos.
            </span>
            <h3>VIOLACIONES DEL SISTEMA O BASES DE DATOS</h3>
            <span className="font-terminos">
              Queda prohibida cualquier tipo de acción o uso de dispositivo,
              software, u otro medio tendiente a interferir tanto en las
              actividades y operatoria de como en las ofertas, descripciones,
              cuentas o bases de datos de la Plataforma En Off. Cualquier
              intromisión, tentativa o actividad violatoria o contraria a las
              leyes sobre derecho de propiedad intelectual y/o a las
              prohibiciones estipuladas en este contrato harán pasible a su
              responsable de las acciones legales pertinentes, y a las sanciones
              previstas por este acuerdo, así como lo hará responsable de
              indemnizar los daños ocasionados. En Off y/o las empresas
              vinculadas podrían tomar cualquier medida que consideren
              razonablemente necesaria para cumplir con la protección de sus
              actividades, bases de datos, cuentas, privacidad de sus Usuarios y
              el cumplimiento de la legislación vigente en materia
              administrativa, civil, penal y tributaria.
            </span>
            <h3>CESIÓN</h3>
            <span className="font-terminos">
              Los Usuarios/Miembros no podrán ceder, transferir ni delegar, bajo
              pena de nulidad, los términos y condiciones del presente Contrato,
              ni sus derechos y obligaciones sin el previo consentimiento
              expreso y manifiesto de En Off. En Off podrá ceder, transferir o
              delegar el presente Contrato y cualquiera de los derechos y
              obligaciones en virtud del mismo, a su exclusivo criterio, sin
              previo aviso.
            </span>
            <h3>NOTIFICACIONES</h3>
            <span className="font-terminos">
              Salvo que se indique lo contrario, cualquier aviso y demás
              comunicaciones destinadas a los Usuarios, necesarias o permitidas
              al tenor del presente Contrato, tendrán lugar de manera general en
              el website de la Plataforma. En casos de excepción y siempre que
              la situación lo amerite, las comunicaciones podrán realizarse de
              manera personal por vía electrónica y serán entregadas por En Off
              mediante correo electrónico y/o por mensaje (incluidos SMS u
              otros) y/o cualquier otro método de contacto que se determine a
              tal efecto.
            </span>
            <h3>SERVICIOS DE TERCEROS </h3>
            <span className="font-terminos">
              xxxxxxxxxxx podrá disponer la finalización de la prestación del
              Servicio, sin necesidad de invocar causa alguna. Dicha
              finalización de servicios será comunicada con una anticipación de
              48 hs a la fecha de terminación a los Usuarios registrados
              mediante una comunicación en la Plataforma.
            </span>
            <h3>ALCANCE LEGAL</h3>
            <span className="font-terminos">
              La Plataforma En Off podrá contener enlaces a sitios web o
              recursos de terceros (“Servicios de Terceros”). Dichos Servicios
              de Terceros podrán estar sujetos a distintos términos y
              condiciones y a distintas prácticas de privacidad. En Off no es
              responsable de la disponibilidad ni de la precisión de dichos
              Servicios de Terceros. Los enlaces a dichos Servicios de Terceros
              no constituyen una confirmación de los mismos por parte de En Off
              y/o sus empresas o sociedades vinculadas. Los terceros que prestan
              y/u ofrecen sus servicios y/o realicen avisos publicitarios en la
              Plataforma En Off, autorizan expresamente a ésta a publicar sus
              datos de contacto (sitio web, correo electrónico y/o teléfonos
              comerciales) y/o sus logos y marcas comerciales en el sitio web
              y/o apps de En Off, sin derecho a resarcimiento y/o cobro de
              tarifas de publicidad por ello.
            </span>
            <h3>DISPONIBILIDAD DEL SERVICIO DE LA PLATAFORMA/SITIO WEB</h3>
            <span className="font-terminos">
              En Off no garantiza la disponibilidad ininterrumpida del servicio
              de la Plataforma/Sitio Web, ni su funcionamiento libre de errores.
              El Usuario registrado reconoce y acepta expresamente que En Off,
              sus empresas y sociedades controladas, controlantes, vinculadas
              y/o intervinientes en la prestación del Servicio, NO SERÁN EN MODO
              ALGUNO RESPONSABLES POR LA SUSPENSIÓN Y/O INTERRUPCIÓN DEL
              SERVICIO Y/O FALLAS EN LA PROVISIÓN DEL SERVICIO, NI RESULTAN POR
              ENDE EN MODO ALGUNO RESPONSABLES POR LOS DAÑOS Y PERJUICIOS QUE
              PUDIERAN DERIVARSE DE ELLO.
            </span>
            <h3>FINALIZACIÓN DE SERVICIOS</h3>
            <span className="font-terminos">
              En Off podrá disponer la finalización de la prestación del
              Servicio, sin necesidad de invocar causa alguna. Dicha
              finalización de servicios será comunicada con una anticipación de
              48 hs a la fecha de terminación a los Usuarios registrados
              mediante una comunicación en la Plataforma.
            </span>
            <h3>ALCANCE LEGAL</h3>
            <span className="font-terminos">
              Este acuerdo no crea ningún contrato de sociedad, de mandato, de
              franquicia, y/o relación laboral entre En Off y el Usuario, ni que
              alguna de las partes tiene poder para representar a la otra. En
              Off no garantiza la veracidad de la publicidad de terceros que
              aparezcan en el sitio y no será responsable por la correspondencia
              o contratos que el usuario celebre con dichos terceros o con otros
              usuarios.
            </span>
            <h3>INDEMNIDAD</h3>
            <span className="font-terminos">
              El Usuario mantendrá indemne a En Off, así como a sus filiales,
              empresas controladas y/o controlantes, funcionarios, directivos,
              sucesores, administradores, representantes y empleados, por
              cualquier reclamo iniciado por otros Usuarios, terceros o por
              cualquier Organismo, relacionado con sus actividades en el Sitio,
              el material publicado y/o difundido, el cumplimiento y/o
              incumplimiento de los Términos y Condiciones Generales o demás
              políticas del sitio web, así como respecto de cualquier violación
              de la normativa vigente o derechos de terceros.
            </span>
            <h3>NULIDAD PARCIAL</h3>
            <span className="font-terminos">
              En caso de declararse la nulidad de alguna de las cláusulas de
              estos Términos y Condiciones Generales, tal nulidad no afectará a
              la validez de las restantes, las cuales mantendrán su plena
              vigencia y efecto.
            </span>
            <h3>ANEXOS</h3>
            <span className="font-terminos">
              Forman parte integral e inseparable de los Términos y Condiciones
              Generales, los restantes documentos y/o secciones de En Off
              incorporados por referencia, donde se detallan políticas y/o
              términos y condiciones de los servicios ofrecidos en el sitio. Los
              mismos se podrán consultar dentro del sitio web mediante los
              enlaces provistos o accediendo directamente a las páginas
              correspondientes.
            </span>
            <h3>JURISDICCION Y LEY APLICABLE</h3>
            <span className="font-terminos">
              Estos Términos y Condiciones estarán regido en todos sus puntos
              por las leyes vigentes en la República Argentina. Cualquier
              controversia derivada del presente acuerdo, su existencia,
              validez, interpretación, alcance o cumplimiento, será sometida
              ante la jurisdicción de los Tribunales Ordinarios del Departamento
              Judicial La Plata, Provincia de Buenos Aires, con renuncia expresa
              a cualquier otro fuero y/o jurisdicción.
            </span>
            <h3>DOMICILIO LEGAL</h3>
            <span className="font-terminos">
              En Off como empresa parte de GRUPO DELSUD ADMINISTRACION
              FINANCIERA E INMOBILIARIA S.R.L. constituye domicilio legal en Av.
              7 N° 840 de la ciudad de La Plata, Provincia de Buenos Aires, C.P.
              1900.
            </span>

          <button className='modal-boton-volver' onClick={handleClose}>Volver</button>
        </Modal.Body>


      </Modal>      }
      </>
  )
}
