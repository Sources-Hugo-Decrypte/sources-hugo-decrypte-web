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
        // Is it really usefull to keep global percentages in this case ?
        /*tooltip: {
          callbacks: {
            footer: function(tooltipItems: Array<any>) {
              let footerText: string = ''
  
              tooltipItems.forEach((tooltipItem) => {
                const index: number = tooltipItem.dataIndex
  
                footerText += 'Représente ' + rawData.top10.percentages[index] + '% des liens au total';
              });
  
              return footerText
            }
          }
        }*/
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

    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
      <SectionTitle title="Par période" />
      <p className="mb-4 text-sm text-gray-700">
        Les graphiques suivants présentent les sources utilisées sur une période donnée.
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