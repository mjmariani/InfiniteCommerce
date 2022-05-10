import "./filter.css";
import React from "react";

import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
function Filter ({ filterData }){

    let [sort, setSort] = React.useState('');
    let [location, setLocation] = React.useState('');

  const handleChangeSort = (event) => {
    setSort(event.target.value);
    filterData(event.target.name, event.target.value);
  };

  const handleChangeLocation = (event) => {
    setLocation(event.target.value);
    filterData(event.target.name, event.target.value);
  };

    return ( 
        <>
        <div className="filter">
        <RadioGroup aria-label="sort_by" name="sort_by" value={sort} onChange={handleChangeSort}>
        <FormControl id="sort_by">
        <FormLabel id="sort_by">Sort By</FormLabel>
            <FormControlLabel value="price_low_to_high" control={<Radio />} label="Price low to high" />
            <FormControlLabel value="price_high_to_low" control={<Radio />} label="Price high to low" />
            <FormControlLabel value="featured" control={<Radio />} label="Featured" />
            <FormControlLabel value="average_review" control={<Radio />} label="Average review" />
            <FormControlLabel value="most_recent" control={<Radio />} label="Most recent" />
            <FormControlLabel value="bestsellers" control={<Radio />} label="Best sellers" />
            <FormControlLabel value="relevance" control={<Radio />} label="Most Relevant" />
        </FormControl>
        </RadioGroup>

        <RadioGroup aria-label="location" name="customer_location" value={location} onChange={handleChangeLocation}>
        <FormControl id="location">
        <FormLabel id="location">Location</FormLabel>
            <FormControlLabel value="" control={<Radio />} label="United States" />
            <FormControlLabel value="ca" control={<Radio />} label="Canada" />
            <FormControlLabel value="mx" control={<Radio />} label="Mexico" />
            <FormControlLabel value="ae" control={<Radio />} label="United Arab Emirates" />
            <FormControlLabel value="gb" control={<Radio />} label="United Kingdom" />
        </FormControl>
        </RadioGroup>
        </div>
        </>
    )
}

export default Filter;