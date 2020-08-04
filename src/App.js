import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState('worldwide');

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch(`https://disease.sh/v3/covid-19/countries`)
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setTableData(data);
          setCountries(countries);
        });
    };
    getCountries();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    // console.log(countryCode);
    setCountry(countryCode);
    const URL =
      countryCode === 'worldwide'
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}>
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
          <InfoBox
            title='Coronavirus Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title='Recovered Cases'
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title='Deaths Cases'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
