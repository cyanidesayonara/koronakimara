import React, {useEffect, useState} from "react";
// @ts-ignore
import {CartesianGrid, Line, LineChart, XAxis, YAxis, BarChart, Bar, Tooltip} from 'recharts';
import coronaService from "../services/corona";

const Corona = () => {
  const [confirmed, setConfirmed] = useState<Corona[]>([]);
  const [deaths, setDeaths] = useState<Corona[]>([]);
  const [recovered, setRecovered] = useState<Corona[]>([]);
  const [latestCase, setLatestCase] = useState<Corona | undefined>(undefined);

  useEffect(() => {
    coronaService.getAllCoronas()
      .then(setCoronas)
      .catch(e => console.log(e));
  }, []);

  interface Coronas {
    confirmed: Corona[];
    deaths: Corona[];
    recovered: Corona[];
  }

  interface Corona {
    id: string;
    date: Date;
    healthCareDistrict: string;
    infectionSourceCountry: string;
    infectionSource: string;
  }

  interface ConfirmedByDistrict {
    district: string;
    size: number;
    coronas: Corona[];
  }

  const setCoronas = (coronas: Coronas) => {
    console.log(coronas.confirmed);
    setConfirmed(coronas.confirmed);
    setDeaths(coronas.deaths);
    setRecovered(coronas.recovered);
    setLatestCase(coronas.confirmed.pop());
  };

  const mapToConfirmedByDistrict = (district: string, coronas: Corona[]) => {
    return {
      district: district,
      size: coronas.length,
      coronas: coronas,
    } as ConfirmedByDistrict;
  };

  const sortByNumberAsc = (number1: number, number2: number) => {
    switch (number1 > number2) {
      case true:
        return 1;
      case false:
        return -1;
      default:
        return 0;
    }
  };

  const confirmedMappedByDistrict = confirmed.reduce(
    (entryMap: Map<string, Corona[]>, e: Corona) => entryMap.set(e.healthCareDistrict, [...entryMap.get(e.healthCareDistrict)||[], e]),
    new Map()
  );

  const confirmedByDistrict = Array.from(confirmedMappedByDistrict)
    .map(([key, value]) => mapToConfirmedByDistrict(key, value))
    .sort((o1, o2) => sortByNumberAsc(o1.size, o2.size));

  const renderBarChart = (
    <BarChart
      width={1000}
      height={1000}
      data={confirmedByDistrict}
    >
      <XAxis type="category" dataKey="district" />
      <YAxis type="number" dataKey="size" />
      <Tooltip />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Bar dataKey="size"  fill="#8884d8" />
    </BarChart>
  );

  const renderLineChart = (
    <LineChart width={1000} height={400} data={confirmedByDistrict}>
      <Line
        type="monotone"
        dataKey="size"
        stroke="#8884d8"
        margin={{ all: 20 }}
      />
      <Tooltip />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="district" />
    </LineChart>
  );

  return (
    <section className="content">
      <h2>
        Tietoa koronasta...
      </h2>
      <p>Vahvistettuja: { confirmed.length }</p>
      <p>Kuolleita: { deaths.length }</p>
      <p>Parantuneita: { recovered.length }</p>
      { latestCase &&
        <p>Viimeisin vahvistettu tapaus: { latestCase.healthCareDistrict }: { latestCase.date }</p>
      }
      { renderBarChart }
      { renderLineChart }
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Date</td>
            <td>District</td>
            <td>Infection Source Country</td>
            <td>Infection Source</td>
          </tr>
        </thead>
        <tbody>
          { confirmed.map((confirmed, i) => (
            <tr key={i}>
              <td>{ confirmed.id }</td>
              <td>{ confirmed.date }</td>
              <td>{ confirmed.healthCareDistrict }</td>
              <td>{ confirmed.infectionSourceCountry }</td>
              <td>{ confirmed.infectionSource }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
};

export default Corona;
