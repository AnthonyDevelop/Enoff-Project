import React, {useState} from 'react'
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
export default function Destacados() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  return (
    <>
    <DateRange
    editableDateInputs={true}
    onChange={item => setState([item.selection])}
    moveRangeOnFirstSelection={false}
    ranges={state}/>
  </>
  )
}
