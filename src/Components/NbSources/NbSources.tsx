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
  import { Line } from 'react-chartjs-2';
  import SectionTitle from "../Common/SectionTitle";
  import NbSourcesData from "../../Data/NbSourcesData";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  function NbSources(rawData: NbSourcesData) {    
    /*const dateLabels: string[] = new Array<string>();
    rawData.date.forEach(dt => {
      //dateLabels.push(dt.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})) // doesnt work
      dateLabels.push(new Date(dt).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}))
    });*/

    const lineData = {
      labels: rawData.date,
      datasets: [
        {
          label: 'Nombre de sources',
          data: rawData.totalSources,
          borderColor: '#ff6384',/* the ref in the color palette is '#fb4da0' but it looks too pinky*/
          backgroundColor: '#ff6384',
        }
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {min: 0}
      },
      // Has no impact :
      /*tooltip: {
        displayColors: false,
        callbacks: {
          footer: function(tooltipItems: Array<any>) {
            let footerText: string = ''

            tooltipItems.forEach((tooltipItem) => {
              const index: number = tooltipItem.dataIndex

              footerText += rawData.totalSources[index] + ' sources';
            });

            return footerText
          }
        }
      }*/
    };

    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
      <SectionTitle title="Sources par vidéos" />
      <p className="mb-4 text-sm text-gray-700">
        Voici le nombre de sources pour chaque vidéo de la chaîne.
      </p>
      <Line options={options} data={lineData} className="shadow-md rounded md:p-5"/>
    </section>;
  }
  
  export default NbSources;