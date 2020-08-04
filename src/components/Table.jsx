import React from 'react';
import numeral from 'numeral';
import './styles/table.css';

const Table = ({ countries }) => {
  return (
    <>
      <div className='table'>
        <table>
          <tbody>
            {countries.map(({ country, cases }) => (
              <tr key={country}>
                <td>{country}</td>
                <td>
                  <strong>{numeral(cases).format()}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
