import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import Map from './components/Map';
import Table from './components/Table';
import InfoBox from './components/InfoBox';
import LineGraph from './components/LineGraph';
import { sortData } from './helpers/sort';
import { prettyStyle } from './helpers/prettyStyle';
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState('worldwide');

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState('cases');

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
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
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
        if (data.countryInfo) {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(5);
        } else {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(3);
        }
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
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyStyle(countryInfo.todayCases)}
            total={prettyStyle(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered Cases'
            cases={prettyStyle(countryInfo.todayRecovered)}
            total={prettyStyle(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths Cases'
            cases={prettyStyle(countryInfo.todayDeaths)}
            total={prettyStyle(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3 className='app__graphTitle'>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
