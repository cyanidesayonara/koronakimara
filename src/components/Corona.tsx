import React, {useEffect, useState} from "react";
import coronaService from "../services/corona";
import { VictoryBar, VictoryChart, VictoryLine, VictoryPie, VictoryStack, VictoryGroup, VictoryTooltip, VictoryTheme } from "victory";

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

  interface MapByDistrict {
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

  const mapByDistrict = (district: string, coronas: Corona[]) => {
    return {
      district: district,
      size: coronas.length,
      coronas: coronas,
    } as MapByDistrict;
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

  const confirmedByDistrict = Array.from(confirmed.reduce(
    (entryMap: Map<string, Corona[]>, e: Corona) => entryMap.set(e.healthCareDistrict, [...entryMap.get(e.healthCareDistrict)||[], e]),
    new Map()
  ))
    .map(([key, value]) => mapByDistrict(key, value))
    .sort((o1, o2) => sortByNumberAsc(o1.size, o2.size));

  const deathsByDistrict = Array.from(deaths.reduce(
    (entryMap: Map<string, Corona[]>, e: Corona) => entryMap.set(e.healthCareDistrict, [...entryMap.get(e.healthCareDistrict)||[], e]),
    new Map()
  ))
    .map(([key, value]) => mapByDistrict(key, value))
    .sort((o1, o2) => sortByNumberAsc(o1.size, o2.size));

  const recoveredByDistrict = Array.from(recovered.reduce(
    (entryMap: Map<string, Corona[]>, e: Corona) => entryMap.set(e.healthCareDistrict, [...entryMap.get(e.healthCareDistrict)||[], e]),
    new Map()
  ))
    .map(([key, value]) => mapByDistrict(key, value))
    .sort((o1, o2) => sortByNumberAsc(o1.size, o2.size));

  const dataset = [confirmedByDistrict, deathsByDistrict, recoveredByDistrict];
  console.log(dataset);
  const renderBarChart = (
    <>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        <VictoryGroup horizontal
                      style={{ data: { width: 6 } }}
                      colorScale={["brown", "tomato", "gold"]}
        >
          <VictoryStack
            colorScale={["black", "blue", "tomato"]}
          >
            {dataset.map((data, i) => {
              return <VictoryBar
                labelComponent={<VictoryTooltip />}
                labels={(datum: { size: number; }) => datum.size}
                data={confirmedByDistrict}
                key={i}
                x="district"
                y="size"
              />;
            })}
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>
    </>
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
      {renderBarChart}
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
