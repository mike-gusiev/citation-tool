import React, { useState } from 'react';
import { AutoComplete, Input, Button } from 'antd';
import { fetchBusinessSuggestions, fetchBusinessDetails } from './api';

const BusinessAutoComplete = ({ onFill }) => {
  const [options, setOptions] = useState([]);
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(false);

  const handleSearch = async (value) => {
    if (autoCompleteEnabled && value) {
      const suggestions = await fetchBusinessSuggestions(value);
      setOptions(suggestions);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = async (value) => {
    if (autoCompleteEnabled) {
      const businessDetails = await fetchBusinessDetails(value);
      onFill(businessDetails);
    }
  };

  const toggleAutoComplete = () => {
    setAutoCompleteEnabled(!autoCompleteEnabled);
    setOptions([]);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <AutoComplete
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        style={{ width: '100%' }}
        placeholder="Search for business"
      >
        <Input />
      </AutoComplete>
      <Button onClick={toggleAutoComplete}>
        {autoCompleteEnabled ? 'Disable AutoComplete' : 'Enable AutoComplete'}
      </Button>
    </div>
  );
};

export default BusinessAutoComplete;