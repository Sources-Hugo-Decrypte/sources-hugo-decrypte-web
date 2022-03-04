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

import SectionTitle from "../Common/SectionTitle";
import PeriodData from "../../Data/PeriodData";
import useFetch from '../../Utils/useFetch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Period() {

  const [periodData, loading] = useFetch<PeriodData>('/.netlify/functions/period');

  const todayDate = new Date();
  const oneMonthAgoDate = new Date();
  oneMonthAgoDate.setDate(todayDate.getDate() - 30);

  if(loading){
    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <SectionTitle title="Le mois passé" />
    <p className="mb-4 text-sm text-gray-700">
      Les graphiques suivants présentent les sources utilisées au cours des 30 derniers jours (du {oneMonthAgoDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})} au {todayDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}).
    </p>
  </section>;
  }

  // moving average of sources per video :
  const avgDataset = new Array<number>();
  let NumElements = 5;  // number of elements to consider to compute the average
  for(let index = 0 ; index < periodData.nbSources.totalSources.length ; index++){
    let avgNb = 0;
    let N=NumElements;
    if(index+1<(NumElements)){N=index+1}
    for (let i = index ; index-i < N ; i--){
      avgNb += periodData.nbSources.totalSources[i];
    }
    avgNb /= N;
    avgDataset.push(avgNb)
  }

  const barData = {
    labels: periodData.top10.labels,
    datasets: [
      {
        label: 'Nombre de liens',
        data: periodData.top10.labels.map((_label, index) => periodData.top10.totalLinks[index]),
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
    labels: periodData.nbSources.date,
    datasets: [
      {
        label: 'Nombre de sources',
        data: periodData.nbSources.totalSources,
        borderColor: '#ff6384',/* the ref in the color palette is '#fb4da0' but it looks too pinky*/
        backgroundColor: '#ff6384',
      },
      {
        label: 'Moyenne',
        data: avgDataset,
        borderColor: '#9da6fb',
        backgroundColor: '#9da6fb',
      }
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        // Disable the posibility to unshow the first elment in the legend :
        onClick: (evt: any, legendItem: { datasetIndex: any; }, legend: { chart: any; }) => {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;

          if(index !== 0){  // no action for first element of legend
            if(ci.data.datasets[index].hidden === false){
              ci.data.datasets[index].hidden = true;
              ci.show(index);
            }
            else{
              ci.data.datasets[index].hidden = false;
              ci.hide(index);
            }
          }
        }
      },
    },
    scales: {
      y: {min: 0}
    },
  };

  return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <SectionTitle title="Le mois passé" />
    <p className="mb-4 text-sm text-gray-700">
      Les graphiques suivants présentent les sources utilisées au cours des 30 derniers jours (du {oneMonthAgoDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})} au {todayDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}).
    </p>

    <div className="shadow-md rounded md:p-5">
      <p className="mb-4 text-sm text-gray-700">Top 10 sur cette période :</p>
      <Bar options={barOptions} data={barData} />
      <p className="mb-4 text-sm text-gray-700">Nombre de sources par vidéo :</p>
      <Line options={lineOptions} data={lineData} />
    </div>
  </section>;
}

export default Period;