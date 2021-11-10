import "./filter.css";
import React, { useState, useEffect, useContext, useCallback } from "react";

import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
function Filter ({ filterData }){

    const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    filterData(event.target.name, event.target.value);
  };

    return ( 
        <>
        <div className="filter">
        <FormControl component="sort_by">
        <FormLabel component="sort_by">Sort By</FormLabel>
        <RadioGroup aria-label="sort_by" name="sort_by" value={value} onChange={handleChange}>
            <FormControlLabel value="price_low_to_high" control={<Radio />} label="price_low_to_high" />
            <FormControlLabel value="price_high_to_low" control={<Radio />} label="price_high_to_low" />
            <FormControlLabel value="featured" control={<Radio />} label="featured" />
            <FormControlLabel value="average_review" control={<Radio />} label="average_review" />
            <FormControlLabel value="most_recent" control={<Radio />} label="most_recent" />
        </RadioGroup>
        </FormControl>

        <FormControl component="location">
        <FormLabel component="location">Location</FormLabel>
        <RadioGroup aria-label="location" name="sort_by" value={value} onChange={handleChange}>
            <FormControlLabel value="" control={<Radio />} label="United States" />
            <FormControlLabel value="ca" control={<Radio />} label="Canada" />
            <FormControlLabel value="mx" control={<Radio />} label="Mexico" />
            <FormControlLabel value="ae" control={<Radio />} label="United Arab Emirates" />
            <FormControlLabel value="gb" control={<Radio />} label="United Kingdom" />
        </RadioGroup>
        </FormControl>
        </div>
        </>
    )
}

export default Filter;