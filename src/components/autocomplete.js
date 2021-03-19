import React, {useEffect, useRef} from 'react'
import { Dropdown } from 'semantic-ui-react';
import useAddressPredictions from "../hooks/useAddressPredictions";

const Autocomplete = ({
  value,
  onChange,
  onSearchChange,
}) => {
  const inputElement = useRef(null);

  useEffect(() => {
    inputElement.current.onfocus = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    };
  });

  const predictions = useAddressPredictions(value);
  return (
    <div style={{
      paddingBottom: '10px',
      margin: '0 auto',
      width: '100%',
    }}>
      <Dropdown
        placeholder='Search for a Place'
        fluid
        search
        selection
        onChange={onChange}
        onSearchChange={onSearchChange}
        options={predictions}
        value={value}
        clearable
        deburr
        ref={inputElement}
      />
    </div>
  )
}

export default Autocomplete