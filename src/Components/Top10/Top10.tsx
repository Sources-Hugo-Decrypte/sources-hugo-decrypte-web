import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SectionTitle from "../Common/SectionTitle";
import Top10Data from "../../Data/Top10Data";
import useFetch from '../../Utils/useFetch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Header() {
  return <div>
    <SectionTitle title="Top 10 des sources" />
    <p className="mb-4 text-sm text-gray-700">
      Ce graphique présente le nombre de liens cités par source depuis la premère video de la chaîne (le 20/12/2015). Pour voir l’ensemble des sources <a href="/allsources" className="underline">cliquez-ici</a>.
    </p>
    </div>;
}

function Top10() {

  const [top10Data, loading, error] = useFetch<Top10Data>('/.netlify/functions/top10');

  if (error) {
    console.error(error)
  }

  const top10DataWaiting: Top10Data = {
    labels: Array(10).fill("chargement"),
    totalLinks: [950, 810, 680, 520, 410, 350, 310, 270, 240, 209],
    percentages: Array(10).fill(0)
  }

  const barDataWaiting = {
    labels: top10DataWaiting.labels,
    datasets: [
      {
        label: 'Nombre de liens',
        data: top10DataWaiting.labels.map((_label, index) => top10DataWaiting.totalLinks[index]),
        borderColor: '#d1d5db',
        borderRadius: 4,
        backgroundColor: '#d1d5db',
      }
    ]
  }

  const optionsWaiting = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    maintainAspectRatio : false,
    plugins: {
      legend: {
        display: false,
      }
    }
  }

  if (loading){
    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
            <Header />
            <div className="h-80 md:h-80 m-1"><Bar options={optionsWaiting} data={barDataWaiting} className="animate-pulse shadow-md rounded md:p-5"/></div>
          </section>;
  }

  const barData = {
    labels: top10Data.labels,
    datasets: [
      {
        label: 'Nombre de liens',
        data: top10Data.labels.map((_label, index) => top10Data.totalLinks[index]),
        borderColor: '#4e5ff9',
        borderRadius: 4,
        backgroundColor: '#9da6fb',
      }
    ]
  }

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    maintainAspectRatio : false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          footer: function(tooltipItems: Array<any>) {
            let footerText: string = ''

            tooltipItems.forEach((tooltipItem) => {
              const index: number = tooltipItem.dataIndex

              footerText += 'Représente ' + top10Data.percentages[index] + '% des liens au total';
            });

            return footerText
          }
        }
      }
    },
  }

  return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <Header />
    <div className="h-80 md:h-80 m-1"><Bar options={options} data={barData} className="shadow-md rounded md:p-5"/></div>
  </section>;
}

export default Top10;