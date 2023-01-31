import React from "react";
import { Panel, PanelGroup, Checkbox } from "rsuite";
import "./configuracion.css"
export default function Configuracion() {
  return (
    <>
      <div className="containerNoti">
        <div className="containerHeader">
          <h1>Configuración</h1>
          <img
            alt=""
            src="https://res.cloudinary.com/grupo-delsud/image/upload/v1662937720/EditorPlus/Notificaciones/Config_ab81l8.svg"
          />
        </div>
        <PanelGroup className="containerConfig" accordion bordered>
          <Panel className="panelConfig" header="En navegador/App" eventKey={1} id="En navegador/App">

          </Panel>
          <Panel className="panelConfig" header="¿Qué correos querés recibir?" eventKey={2} id="¿Qué correos querés recibir?">
            <div className="containerContentPanel">
              <h4>Cuando tu video sea monetizado.</h4>
              <Checkbox className="checkBoxConfig"/>
            </div>
            <div className="containerContentPanel">
              <h4>Cuando tu video sea descargado (sin monetización).</h4>
              <Checkbox className="checkBoxConfig"/>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
}
