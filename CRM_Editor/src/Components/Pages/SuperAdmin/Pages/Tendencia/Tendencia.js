import React, { useState } from "react";
import { Input, InputGroup } from "rsuite";
import Select from "react-select";
import { DateRange } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import SearchIcon from "@rsuite/icons/Search";
import { MdDelete } from "react-icons/md";
import { GoCalendar } from "react-icons/go";
import { AiFillPlusCircle } from "react-icons/ai";
import { Rate } from "rsuite";

import { TiDelete } from "react-icons/ti";

function Tendencia() {
  const [calendario, setCalendario] = useState(false);
  const [abrirModalSubirVideo, setAbrirModalSubirVideo] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const handleSubirVideo = () => {
    if (abrirModalSubirVideo == true) {
      setAbrirModalSubirVideo(false);
    } else {
      setAbrirModalSubirVideo(!abrirModalSubirVideo);
    }
  };

  const options = [
    {
      value: "none",
      label: "Calificación",
    },
    {
      value: "1",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={1}
          />
        </div>
      ),
    },
    {
      value: "2",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={2}
          />
        </div>
      ),
    },
    {
      value: "3",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={3}
          />
        </div>
      ),
    },
    {
      value: "4",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={4}
          />
        </div>
      ),
    },
    {
      value: "5",
      label: (
        <div>
          <Rate
            className="sidebar-user-rate"
            style={{ color: "#DDE100!important" }}
            readOnly
            value={5}
          />
        </div>
      ),
    },
  ];

  const handleTypeSelect = (e) => {
    setSelectedOption(e.value);
  };

  const categorias = [
    { value: "Deporte", label: "Deporte" },
    { value: "Espectaculos", label: "Espectaculos" },
    { value: "Arte", label: "Arte" },
  ];

  function activarCalendario() {
    setCalendario(!calendario);
  }

  return (
    <>
      <div className="explorar-principal">
        <div className="contenedor-buscador-explorar">
          <div className="box-buscador-explorar ">
            <div>
              <h1 className="titulo-explorar">Tendencia</h1>
            </div>
            <div>
              <InputGroup>
                <Input
                  className="input-buscador-explorer"
                  placeholder="Buscar video por título"
                />
                <InputGroup.Addon className="background-buscador">
                  <SearchIcon color="white" fontSize="25px" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>
        </div>
        <div className="contenedor-vistas-explorar">
          <div className="mis-videos-filtros">
            <MdDelete className="filtro-icono" color='#131838'/>
            {calendario === true ? (
              <button
                className="button-cerrar-calendario"
                onClick={activarCalendario}
              >
                <TiDelete fontSize={30} color="#DA643A" />
              </button>
            ) : (
              <GoCalendar
                className="filtro-icono"
                onClick={activarCalendario}
                style={{ cursor: "pointer" }}
                placement="bottomStart"
              />
            )}
            <Select
              className="select-clasificacion"
              isSearchable={false}
              options={categorias}
              placeholder={"Categorías"}
              onChange={handleTypeSelect}
              value={categorias.filter(function (option) {
                return option.value === selectedOption;
              })}
            />
            <Select
              className="select-clasificacion"
              isSearchable={false}
              options={options}
              placeholder={"Calificación"}
              onChange={handleTypeSelect}
              value={options.filter(function (option) {
                return option.value === selectedOption;
              })}
            />
            <div className="checkbox-urgente">
              <input type="checkbox" id="urgente" value="urgente" />
              <label className="urgente-text">URGENTE</label>
            </div>
            {calendario && (
              <div className="calendario-container">
                <DateRange
                  maxDate={new Date()}
                  minDate={new Date("01-11-2022")}
                  locale={locales["es"]}
                  className="calendario-filtro"
                  editableDateInputs={true}
                  onChange={(item) => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Tendencia;
