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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Top10(rawData: Top10Data) {
  const barData = {
    labels: rawData.labels,
    datasets: [
      {
        label: 'Nombre de liens',
        data: rawData.labels.map((_label, index) => rawData.totalLinks[index]),
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
    responsive: true,
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

              footerText += 'Représente ' + rawData.percentages[index] + '% des liens au total';
            });

            return footerText
          }
        }
      }
    },
  }

  return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <SectionTitle title="Top 10 des sources" />
    <p className="mb-4 text-sm text-gray-700">
      Ce graphique présente le nombre de liens cités par source depuis la premère video de la chaîne (le 20/12/2015). Pour voir l’ensemble des sources <a href="/allsources" className="underline">cliquez-ici</a>.
    </p>
    <Bar options={options} data={barData} className="shadow-md rounded md:p-5"/>
  </section>;
}

export default Top10;