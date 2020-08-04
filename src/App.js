import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import './App.css';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  useEffect(() => {
    const getCountries = async () => {
      await fetch(`https://disease.sh/v3/covid-19/countries`)
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    getCountries();
  }, []);
  const onCountryChange = (e) => {
    const countryCode = e.target.value;
    // console.log(countryCode);
    setCountry(countryCode);
  };
  return (
    <div className='App'>
      <div className='app__header'>
        <h1>COVID-19</h1>
        <FormControl className='app__dropdown'>
          <Select variant='outlined' onChange={onCountryChange} value={country}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.name} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className='app__stats'>
        <InfoBox title='Coronavirus Cases' cases={1234} total={2000} />
        <InfoBox title='Recovered Cases' cases={1234} total={2000} />
        <InfoBox title='Deaths Cases' cases={1234} total={2000} />
      </div>
      <Map />
      {/* table  */}
      {/* Graph  */}
      {/* map  */}
    </div>
  );
}

export default App;
