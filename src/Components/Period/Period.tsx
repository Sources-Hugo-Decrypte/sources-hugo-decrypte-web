import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  } from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

import { forwardRef, LegacyRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale'

import SectionTitle from "../Common/SectionTitle";
import PeriodData from "../../Data/PeriodData";
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Period(rawData: PeriodData) {

  const barData = {
    labels: rawData.top10.labels,
    datasets: [
      {
        label: 'Nombre de liens',
        data: rawData.top10.labels.map((_label, index) => rawData.top10.totalLinks[index]),
        borderColor: '#4e5ff9',
        borderRadius: 4,
        backgroundColor: '#9da6fb',
      }
    ]
  }

  const barOptions = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const lineData = {
    labels: rawData.nbSources.date,
    datasets: [
      {
        label: 'Nombre de sources',
        data: rawData.nbSources.totalSources,
        borderColor: '#ff6384',/* the ref in the color palette is '#fb4da0' but it looks too pinky*/
        backgroundColor: '#ff6384',
      }
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {min: 0}
    },
  };

  var barReference: ChartJSOrUndefined<"bar", number[], string> | null;
  var lineReference: ChartJSOrUndefined<"line", number[], string> | null;
  
  function afficherPeriode() {
    if(barData.labels[0] === "lemonde.fr"){barData.labels[0] = "lefauxmonde.fr"}
    else{barData.labels[0] = "lemonde.fr"};
    barReference?.update();
    lineReference?.update();
  }

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <SectionTitle title="Par période" />
    <p className="mb-4 text-sm text-gray-700">
      Les graphiques suivants présentent les sources utilisées sur une période donnée.
    </p>

    <div className="flex flex-col md:flex-row md:justify-around gap-3">
      Début:
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        startDate={startDate}
        endDate={endDate}
        minDate={new Date("12/20/2015")}
        maxDate={endDate}
        dateFormat="dd/MM/yyyy"
        locale={fr}
      />
    </div>

    <div className="flex flex-col md:flex-row md:justify-around gap-3">
      Fin:
      <DatePicker
        selected={endDate}
        onChange={(date: Date) => setEndDate(date)}
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={new Date()}
        dateFormat="dd/MM/yyyy"
        locale={fr}
      />
    </div>
    
    <button onClick={afficherPeriode}>
      Afficher
    </button>
    <div className="shadow-md rounded md:p-5">
      <p className="mb-4 text-sm text-gray-700">Top 10 sur cette période :</p>
      <Bar options={barOptions} data={barData} ref={(reference) => barReference=reference}/>
      <p className="mb-4 text-sm text-gray-700">Nombre de sources par vidéo :</p>
      <Line options={lineOptions} data={lineData} ref={(reference) => lineReference=reference}/>
    </div>
  </section>;
}

export default Period;