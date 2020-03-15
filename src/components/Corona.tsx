import React, { useState, useEffect } from "react";
import coronaService from "../services/corona";

const Corona = () => {
  const [confirmed, setConfirmed] = useState<Array<Corona>>([]);
  const [deaths, setDeaths] = useState<Array<Corona>>([]);
  const [recovered, setRecovered] = useState<Array<Corona>>([]);

  useEffect(() => {
    coronaService.getAllCoronas()
      .then(setCoronas)
      .catch(e => console.log(e));
  }, []);

  interface Coronas {
    confirmed: Array<Corona>;
    deaths: Array<Corona>;
    recovered: Array<Corona>;
  }

  interface Corona {
    id: string;
    date: Date;
    healthCareDistrict: string;
    infectionSourceCountry: string;
    infectionSource: string;
  }

  const setCoronas = (coronas: Coronas) => {
    console.log(coronas.confirmed);
    setConfirmed(coronas.confirmed);
    setDeaths(coronas.deaths);
    setRecovered(coronas.recovered);
  };

  return (
    <div>
      <h2>
        Tietoa koronasta...
      </h2>
      <p>{ confirmed.length }</p>
      { confirmed.map((confirmed, i) => (
        <p key={i}>{ confirmed.id } - { confirmed.date } - { confirmed.healthCareDistrict }</p>
      ))}
    </div>
  )
};

export default Corona;
