import React from "react";
import "./politicaDePrivacidad.css";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

export default function PoliticaDePrivacidad() {
  const vistaMobile = useMediaQuery({
    query: "(max-width: 998px)",
  });

  return (
    <>
      <div className="containerPolity">
        <div className="titlePolity">
          <h1 className="titulo-politcas">
            POLITICAS DE PRIVACIDAD Y USO DE DATOS
          </h1>
        </div>
        <div className="containerAllPolity">
          <div className="contentAllPolity">
            <h3>INTRODUCCIÓN</h3>
            <span className="font-terminos">
              Los presentes términos de Políticas de privacidad y uso de datos
              son aplicables al uso, contenido y servicios ofrecidos por EN OFF
              empresa parte de GRUPO DELSUD ADMINISTRACION FINANCIERA E
              INMOBILIARIA S.R.L., CUIT 30-71616529-5, en el sitio web
              www.enoff.com.ar y/o en las aplicaciones (apps) vinculadas
              (denominados colectivamente, la “Plataforma EN OFF” o simplemente
              “EN OFF”), y son parte de los Términos y Condiciones Generales del
              sitio web. Por favor lea cuidadosamente este documento el cual
              contiene información importante que debe conocer antes de
              continuar utilizando nuestro sitio web o servicios. Si continúa
              utilizando el sitio web y los servicios de EN OFF, se considerará
              que ha aceptado estas políticas de privacidad y uso de datos. Al
              leer estas Políticas de Privacidad y uso de datos, se le informará
              sobre lo siguiente:
              <ul>
                <li>
                  Qué información de identificación personal suya o qué
                  información de identificación personal de terceros se recopila
                  de usted a través del Sitio Web, así como a través de los
                  Productos y Servicios;
                </li>
                <li>la organización que recopila la información </li>
                <li> cómo se usa y se usará la información;</li>
                <li>con quién puede ser compartida la información;</li>
                <li>
                  qué opciones están disponibles para usted con respecto a la
                  recopilación, el uso y la distribución de la información;
                </li>
                <li>
                  el tipo de procedimientos de seguridad establecidos para
                  proteger la pérdida, el mal uso o la alteración de la
                  información bajo el control de EN OFF;
                </li>
                <li>
                  cómo puede acceder y corregir cualquier inexactitud en la
                  información recopilada sobre usted.
                </li>
              </ul>
            </span>
            <h3>1) Cuenta de Usuario</h3>
            <span className="font-terminos">
              Para utilizar la plataforma y/o nuestros servicios, Usted tendrá
              la oportunidad de crear una Cuenta de Usuario que contenga su
              información personal. Se requiere una cuenta de Usuario para usar
              la mayoría de los Productos y Servicios ofrecidos en el Sitio Web.
              Una vez que se haya creado la cuenta de Usuario, podrá acceder,
              revisar y actualizar su información en la Cuenta de Usuario en
              línea en el Sitio Web. Si desea desactivar su Cuenta de Usuario,
              usted puede hacerlo enviando un correo electrónico a
              soporte@enoff.com.ar. Cuando usted desactive su Cuenta de Usuario,
              toda la información almacenada y mantenida como parte de su cuenta
              será eliminada de nuestros servidores, incluidos los archivos
              almacenados a través del Sitio Web o sus Productos y Servicios. La
              copia de seguridad archivada de sus datos se eliminará durante el
              siguiente ciclo de copia de seguridad de EN OFF. Si usted crea una
              cuenta, entonces tiene derecho a acceder y cambiar su información
              personal y preferencias de privacidad en cualquier momento
              iniciando sesión en su Cuenta de Usuario, donde usted puede ver la
              información personal y solicitar cambiar la misma y/o preferencias
              de privacidad contactándonos en soporte@enoff.com.ar. El usuario
              que cree una cuenta se hace único y exclusivo responsable de los
              datos agregados en la misma, como así también de todos los cambios
              que el propio usuario realice, eximiendo de responsabilidad a EN
              OFF de la exactitud y veracidad de dicha información.
            </span>
            <h3>2) Qué información recopilamos</h3>
            <span className="font-terminos">
              Recopilamos los datos informados por el usuario como nombre
              completo, fecha de nacimiento, número de documento, dirección de
              correo electrónico y teléfono de contacto. Adicionalmente, al
              solicitar Productos y Servicios a través del Sitio Web, se le
              puede solicitar que proporcione un número cuenta y/o información
              de facturación y envío que permita la consumación de las
              transacciones. La información anterior es recopilada y procesada
              por los servicios de pago en línea, incluidos, entre otros, los
              servicios de cuentas comerciales, que podemos utilizar para el
              procesamiento de pagos, incluidas las renovaciones automáticas de
              suscripciones. Además, podemos solicitar una imagen del documento
              nacional de identidad, con objeto de constatar su identidad.
              También recopilamos datos sobre acceso e interacción con la
              plataforma, como dirección IP, características del navegador y
              dispositivo, URL de referencia, entre otras. Usamos la información
              obtenida a través de cookies para analizar las búsquedas
              realizadas, mejorar nuestras iniciativas comerciales y
              promocionales, mostrar publicidad o promociones, banners de
              interés, noticias sobre EN OFF o las empresas del Grupo,
              perfeccionar y personalizar nuestra oferta de contenidos y
              artículos, presentación y servicios, así como promover y hacer
              cumplir las reglas y seguridad del sitio; también las utilizamos
              para que el usuario no tenga que introducir su clave tan
              frecuentemente durante una sesión de navegación, contabilizar y
              corroborar las inscripciones, la actividad del usuario y otros
              conceptos para acuerdos comerciales, siempre teniendo como
              objetivo de la instalación de las cookies, el beneficio del
              usuario que la recibe, y las cuales no serán usadas con fines
              ajenos a EN OFF. Asimismo, almacenamos cookies para poder ofrecer
              una experiencia más interactiva en el sitio, basada en las
              acciones del usuario.
            </span>
            <h3>3) Sitios web de terceros</h3>
            <span className="font-terminos">
              El Sitio Web puede contener enlaces a sitios web que son propiedad
              de terceros y operados por terceros. Dichos enlaces están
              presentes para su conveniencia e información. EN OFF no controla
              estos sitios web de terceros y no es responsable de su contenido o
              prácticas de privacidad. EN OFF no controla las políticas de
              recopilación y distribución de información en dichos sitios web
              salvo los que están bajo el control de EN OFF. El contenido en
              sitios web de terceros puede no reflejar productos, servicios o
              información provista por EN OFF. Los terceros también pueden
              establecer sus propias cookies y/u otras herramientas, que pueden
              usarse para identificar algunas de sus preferencias o para
              reconocerlo si usted ya se ha contactado con terceros. EN OFF no
              controla el uso de dicha tecnología por parte de terceros, la
              información que recopilan o cómo utilizan dicha información. Usted
              debe dirigir todas sus inquietudes sobre cualquier Sitio Web de
              terceros al administrador de dichos sitios.
            </span>
            <h3>4) Cómo usamos la información</h3>
            <span className="font-terminos">
              La información recopilada es exclusivamente para uso interna de EN
              OFF, sus empresas asociadas y/o parcialmente con terceros
              contratantes, con el fin de establecer contacto con los clientes
              interesados, mantener relación e identificar a los mismos,
              optimizar la interactividad del sitio, conocer las preferencias de
              los usuarios, identificar la pertinencia de los productos
              ofrecidos, suscribir y formalizar contratos de servicios ofrecidos
              en el sitio web y generar acciones de promoción en base a las
              preferencias del usuario.
            </span>
            <h3>5) Información compartida</h3>
            <span className="font-terminos">
              El resguardo de la privacidad de los usuarios es muy importante
              para EN OFF y empresas asociadas. Por ello, no vendemos ni
              comercializamos información que identifique a nuestros usuarios.
              Tampoco compartimos o transferimos de ningún otro modo su
              información personal a terceros, excepto con: a) “GRUPO DELSUD”:
              sociedades que pertenezcan a nuestro grupo corporativo, que operan
              bajo nuestros mismos procesos y políticas internas, ya sean
              sociedades controladas, controlantes o afiliadas con GRUPO DELSUD,
              para cumplir con nuestra normativa interna, prevenir fraudes,
              gestionar riesgos y facilitar la gestión de los servicios y
              productos de GRUPO DELSUD; b) “Autoridades públicas”: las
              autoridades administrativas y judiciales que en ejercicio de su
              competencia requieran información, aunque no exista una orden ni
              una citación ejecutiva o judicial al efecto, con la finalidades
              de: (i) colaborar en la investigación y denunciar fraudes,
              piratería, violaciones de propiedad intelectual o industrial o
              cualquier otro ilícito, así como cualquier actividad o
              circunstancia que pudiera generarle responsabilidad legal a GRUPO
              DELSUD y/o a sus usuarios; (ii) salvaguardar de un interés
              público, la procuración o administración de justicia, el
              reconocimiento, ejercicio o defensa de un derecho en un proceso
              judicial o administrativo, y/o la resolución de controversias; y
              (iii) dar cumplimiento a alguna ley, reglamento o disposición
              legal aplicable, o a algún mandato de autoridad competente
              debidamente fundado y motivado; c) "Intervinientes en Disputas”:
              autoridades, amigables componedores, tribunales o entidades que
              intervengan en solución de disputas con la finalidad de resolver
              las controversias que se llegaran a suscitar entre usuarios o
              entre éstos y cualquiera de las empresas de Grupo Delsud y/o sus
              asociadas; d) “Entidades públicas y/o privadas que prestan
              servicios de información crediticia”: EN OFF y/o Grupo Delsud
              podrá, siempre que la legislación aplicable así lo permita,
              compartir con entidades públicas o privadas que brindan servicios
              de información o riesgo crediticio, información vinculada al
              comportamiento crediticio o al cumplimiento o incumplimiento de
              obligaciones de contenido patrimonial del usuario; e) “Terceros
              contratantes”: EN OFF podrá compartir información parcial del
              usuario con otros usuarios de la plataforma, cuando la misma sea
              necesaria para la suscripción de contratos entre los mismos y/o
              como parte de los servicios ofrecidos en la plataforma. Asimismo,
              EN OFF, Grupo Delsud y/o sus asociadas podrá divulgar información
              personal discrecionalmente a otros usuarios de los Sitios Web y/o
              los Servicios, entidades o terceros cuando haya motivos
              suficientes para considerar que la actividad del usuario sea
              sospechosa de intentar o cometer un delito o intentar perjudicar a
              otras personas. El usuario presta su consentimiento expreso e
              informado para que EN OFF y/o Grupo Delsud ceda, transmita o
              transfiera su información personal a los destinatarios detallados
              en esta Declaración de Privacidad. EN OFF y/o Grupo Delsud no será
              responsable por el uso indebido de la información personal de sus
              usuarios que haga cualquier tercero cuando sean estos terceros
              quienes directamente recolecten y/o traten su información
              personal.
            </span>
            <h3>6) Cookies y tecnologías de seguimiento</h3>
            <span className="font-terminos">
              El usuario reconoce y acepta expresamente que EN OFF podrá
              utilizar un sistema de seguimiento de conducta mediante la
              utilización de "cookies" y/u otras tecnologías similares de
              seguimiento. Estas tecnologías se utilizan con el fin de conocer
              los intereses y el comportamiento de quienes visitan o son
              usuarios de nuestro sitio web y, de esa forma, darles un mejor
              servicio o proveerles información relacionada. Tus datos
              personales obtenidos a través de estas tecnologías no serán
              transferidos a terceros de una manera diferente a las descritas en
              esta Declaración de Privacidad. Adicionalmente, se pueden
              encontrar "cookies" u otros sistemas similares instalados por
              terceros en ciertas páginas de nuestros sitios web o utilizados
              por anunciantes ajenos a EN OFF. Tener en cuenta que la
              instalación, permanencia y existencia de las cookies en tu
              computadora o dispositivo depende de la exclusiva voluntad del
              usuario y pueden ser eliminadas cuando así lo desee. Se puede
              configurar las preferencias de cookies desde la sección de
              Privacidad o desde tu navegador.
            </span>
            <h3>7) Opciones disponibles</h3>
            <span className="font-terminos">
              Usted siempre puede elegir si desea o no divulgar información de
              identificación personal y esa elección no le impedirá usar el
              Sitio Web. Sin embargo, tenga en cuenta que si elige no dar la
              información solicitada, es posible que no podamos proporcionarle
              algunos de los servicios que dependen de la recopilación de esta
              información y se le dará la oportunidad de "aceptar" y elegir sus
              preferencias para cualquier artículo que sea opcional y que no sea
              un requisito previo para la prestación de dichos servicios. Usted
              puede elegir en cualquier momento dejar de recibir correos
              electrónicos de EN OFF, excepto cuando haya suscripto un contrato
              con y/o a través de EN OFF, y que el mismo haya sido constituido
              como domicilio electrónico y/o de notificaciones electrónicas. Si
              usted elige "excluirse", no le enviaremos correos electrónicos.
              Sin embargo, podemos continuar utilizando su información personal
              para fines internos, para mejorar su experiencia de usuario o
              según sea necesario para administrar el sitio o cumplir con
              contratos vigentes y/o con la ley aplicable. Nos reservamos el
              derecho de enviar un correo electrónico de confirmación de
              registro por única vez y mensajes de alerta de servicio
              infrecuentes a los usuarios para informarles de cambios
              específicos que pueden afectar su capacidad de utilizar un
              servicio al que se han suscrito anteriormente, independientemente
              de cual sea el estado de la opción de contacto por correo
              electrónico. También nos reservamos el derecho de contactarnos con
              usted si nos vemos obligados a hacerlo como parte de un
              procedimiento legal o si ha habido una violación de los acuerdos
              aplicables de licencia, garantía y compra.
            </span>
            <h3>8) Actualización de términos</h3>
            <span className="font-terminos">
              Con motivo de mejorar la calidad de los servicios ofrecidos, y/o
              adaptar nuestros contenidos y servicios a cambios en la
              legislación vigente y/o por requerimiento de organismos estatales,
              EN OFF y/o Grupo Delsud puede modificar estas Políticas de
              privacidad. EN OFF quiere que usted siempre esté al tanto de qué
              información personal recopilamos, cómo la usamos y bajo qué
              circunstancias la divulgamos. Como se describe aquí, toda la
              información personal que recopilamos y mantenemos estará sujeta a
              la versión de la Política de Privacidad vigente al momento de
              dicha recopilación. Todos los cambios efectuados serán publicados
              en el sitio web y se considerará que usted ha sido informado y ha
              aceptado dichos cambios si continua usando la plataforma sin
              objeciones expresas. Si como resultado de tales cambios, usted
              desea alterar las formas en que EN OFF puede usar su información
              personal, puede hacerlo siguiendo el procedimiento descrito en la
              sección Opciones Disponibles para Usted de esta Política de
              Privacidad.
            </span>
            <h3>9) Responsabilidad del usuario</h3>
            <span className="font-terminos">
              a) Usar la plataforma conforme a su finalidad b) Informar los
              datos personales requeridos con exactitud y veracidad c) Mantener
              en reserva la clave de acceso. EN OFF no se hace responsable por
              los perjuicios que pueda causar la operación de una cuenta por un
              tercero a partir del conocimiento de la clave de acceso d)
              Mantener actualizados los datos personales. El usuario no sólo
              debe consignar con precisión los datos personales al momento de la
              registración, sino también debe rectificarlos cuando se produzcan
              modificaciones e) Intercambiar o compartir información de acuerdo
              a las pautas estipuladas por el operador. f) Comunicarse
              inmediatamente con EN OFF, por los canales indicados, ante
              actividad inusual o sospechosa en su cuenta.
            </span>
            <h3>10) Almacenamiento de información</h3>
            <span className="font-terminos">
              EN OFF se compromete a proteger la seguridad de su información
              personal. Utilizamos una variedad de tecnologías y procedimientos
              de seguridad para ayudar a proteger su información personal. EN
              OFF opera redes de datos seguras que están protegidas por
              firewalls estándar y sistemas de protección con contraseña.
              Nuestras políticas de seguridad y privacidad son revisadas y
              mejoradas periódicamente según sea necesario, y sólo las personas
              autorizadas tienen acceso a la información proporcionada por
              nuestros usuarios. EN OFF toma medidas para garantizar que su
              información se trate de forma segura y de conformidad con estas
              Políticas de Privacidad y Uso de Datos. Trabajamos para proteger a
              EN OFF y a nuestros usuarios de accesos no autorizados o
              alteraciones, divulgaciones o destrucción no autorizada de la
              información que poseemos. En particular:
              <ul>
                <li>Encriptamos nuestro servicio utilizando SSL.</li>
                <li>
                  Revisamos activa y periódicamente las prácticas de
                  recolección, almacenamiento y procesamiento de información,
                  incluyendo medidas de seguridad físicas, para estar protegidos
                  de accesos no autorizados a nuestros sistemas.
                </li>
                <li>
                  Restringimos el acceso a información personal a los empleados
                  de EN OFF, quienes necesitan conocer esta información para su
                  procesamiento, los cuales están sujetos a estrictas
                  obligaciones contractuales de confidencialidad, y pueden ser
                  sancionados o despedidos en caso de no cumplir con dichas
                  obligaciones.{" "}
                </li>
                <span className="font-terminos">
                  Solo almacenaremos la información personal durante el tiempo
                  necesario para cumplir con el propósito para el que se ha
                  recopilado, para cumplir con requisitos reglamentarios o
                  legales, o durante el periodo de prescripción legal de
                  posibles responsabilidades legales o contractuales. Una vez
                  concluido el lapso, los datos serán eliminados o anonimizados
                  de manera tal que no pueda ser individualizada ninguna
                  persona, según lo permita la normativa vigente.
                </span>
              </ul>
            </span>
            <h3>11) Contacto</h3>
            <span className="font-terminos">
              Los usuarios pueden comunicarse en todo momento con la empresa a
              través del correo electrónico soporte@enoff.com.ar.
            </span>
            <h3>12) Jurisdicción y ley aplicable</h3>
            <span className="font-terminos">
              Las presentes Políticas de Privacidad y Uso de Datos, como así
              también las declaraciones de privacidad incluidas, se regirán por
              las leyes de la República Argentina. Ante cualquier controversia o
              divergencia relacionada con la interpretación, validez,
              celebración o cumplimiento de las mismas, el usuario y EN OFF
              declaran que se someten a la jurisdicción exclusiva de los
              Tribunales Ordinarios de La Plata, Pcia de Bs As, renunciando
              expresamente a cualquier otro fuero y/o jurisdicción que pudiera
              corresponderles.
            </span>
            <hr />
            <h3 style={{ textAlign: "center" }}>TARIFAS Y TÉRMINOS DE PAGO</h3>
            <hr />
            <h3>INTRODUCCIÓN</h3>
            <span className="font-terminos">
              Las presentes Tarifas y Términos de Pago son aplicables al uso,
              contenido y servicios ofrecidos por EN OFF empresa parte de GRUPO
              DELSUD ADMINISTRACION FINANCIERA E INMOBILIARIA S.R.L., CUIT
              30-71616529-5, en el sitio web www.enoff.com.ar y/o en las
              aplicaciones (apps) vinculadas (denominados colectivamente, la
              “Plataforma EN OFF” o simplemente “EN OFF”), y son parte de los
              Términos y Condiciones Generales del sitio web. Por favor lea
              cuidadosamente este documento el cual contiene información
              importante que debe conocer antes de continuar utilizando nuestro
              sitio web o servicios. Si continúa utilizando el sitio web y los
              servicios de EN OFF, se considerará que ha aceptado estas tarifas
              y/o términos de pago.
            </span>
            <h3>1) PUBLICACIONES</h3>
            <span className="font-terminos">
              Para publicar o subir contenido utilizando la plataforma y/o
              nuestros servicios, Usted tendrá la oportunidad de crear una
              Cuenta de Usuario que contenga su información personal. En caso de
              utilización del contenido subido a nuestra plataforma por el
              usuario, EN OFF abonará a su autor una suma de acuerdo a los
              términos y condiciones vigentes y al cuadro tarifario adjunto.
            </span>
            <hr/>
            <table style={{width:'80%'}}>
              <tr style={{border:'1px solid rgb(0 0 0)'}}>
                <th style={{border:'1px solid rgb(0 0 0)',textAlign:'center'}}>Precio Base</th>
                <th style={{border:'1px solid rgb(0 0 0)',textAlign:'center'}}>Precio Especial</th>
              </tr>
              <tr style={{border:'1px solid rgb(0 0 0)'}}>
                <td style={{border:'1px solid rgb(0 0 0)',textAlign:'center'}}>Desde $2.000</td>
                <td style={{border:'1px solid rgb(0 0 0)',textAlign:'center'}}>Hasta $100.000</td>
              </tr>
            </table>
            <hr/>
            <h3>2) PAGOS</h3>
            <span className="font-terminos">
              Los pagos señalados en la cláusula anterior serán abonados por EN
              OFF en el término de 24 hs de la utilización y/o compra del
              contenido audiovisual elegido, a través de las modalidades y/o
              canales de pago habilitados por la Plataforma. EN OFF realizará
              las retenciones y/o el pago de tributos correspondientes de
              acuerdo a la legislación vigente y/o por indicación de los
              organismos de control, tributarios y/o judiciales intervinientes.
              El usuario autoriza a EN OFF, y/o las empresas asociadas, a
              retener y/o debitar del procesamiento de pagos los importes
              aplicables por tales retenciones de tarifas y/o pago de tributos.
            </span>
            <h3>3) RESPONSABILIDAD DE LOS USUARIOS</h3>
            <span className="font-terminos">
              Es responsabilidad total y excluyente de los usuarios:
              <ul>
                <li>
                  a) Verificar los términos de pago, tarifas y comisiones
                  aplicables al momento del envío del contenido a la plataforma
                  EN OFF;
                </li>
                <li>
                  b) Usar la plataforma y/o canales de pago habilitados por EN
                  OFF conforme a su finalidad;
                </li>
                <li>
                  c) Informar los datos personales requeridos en cada caso
                  (cuenta, CBU/CVU) con exactitud y veracidad;
                </li>
                <li>
                  d) Mantener en reserva claves de acceso y/o información de
                  otros pagos o transacciones a terceros. EN OFF no se hace
                  responsable por los perjuicios que pueda causar la operación
                  de una cuenta por un tercero a partir del conocimiento de sus
                  claves de acceso y/o información de otras transacciones;
                </li>
                <li>
                  e) Intercambiar o compartir información de acuerdo a las
                  pautas estipuladas por el operador;
                </li>
                <li>
                  f) Comunicarse inmediatamente con EN OFF, por los canales
                  indicados, ante actividad inusual o sospechosa en su cuenta
                  y/o pagos.
                </li>
              </ul>
            </span>
            <h3>4) CONTACTO</h3>
            <span className="font-terminos">
              Los usuarios pueden comunicarse en todo momento con la empresa a
              través del correo electrónico soporte@enoff.com.ar.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
