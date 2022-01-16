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
        label: 'Nombre de liens cités par source',
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
        position: 'bottom' as const,
      },
      title: {
        position: 'bottom' as const,
        display: true,
        text: 'Top 10 des sources',
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

  return <section className="w-2/3 mx-auto">
    <SectionTitle title="Top 10 des sources" />
    <Bar options={options} data={barData} />
  </section>;
}

export default Top10;