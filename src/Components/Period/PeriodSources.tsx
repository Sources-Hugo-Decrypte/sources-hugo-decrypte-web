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
  
  import PeriodSourcesData from "../../Data/PeriodSourcesData";
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

  function Header() {
    return <p className="ml-4 mb-4 text-sm font-bold text-gray-700">Nombre de sources par vidéo :</p>
  }
  
  function PeriodSources() {
  
    const [periodSourcesData, loading] = useFetch<PeriodSourcesData>('/.netlify/functions/periodsources');

    // Data for waiting animation :
    const periodSourcesDataWaiting: PeriodSourcesData = {
        nbSources: {
            date: Array(25).fill("chargement"),
            totalSources: Array(25).fill(0)
        }
    }
    const lineDataWaiting = {
        labels: periodSourcesDataWaiting.nbSources.date,
        datasets: [
          {
            label: 'Nombre de sources',
            data: periodSourcesDataWaiting.nbSources.totalSources,
            borderColor: '#d1d5db',
            backgroundColor: '#d1d5db',
          }
        ],
      };
    const lineOptionsWaiting = {
        maintainAspectRatio : false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
          y: {min: 0, max: 20}
        },
      };
    if(loading){
      return <div>
        <Header />
        <div className="animate-pulse h-80 md:h-80 m-1"><Line options={lineOptionsWaiting} data={lineDataWaiting} /></div>
      </div>;
    }
  
  
    // moving average of sources per video :
    const avgSourcesDataset = new Array<number>();
    let NumElements = 5;  // number of elements to consider to compute the average
    for(let index = 0 ; index < periodSourcesData.nbSources.totalSources.length ; index++){
      let avgNb = 0;
      let N=NumElements;
      if(index+1<(NumElements)){N=index+1}
      for (let i = index ; index-i < N ; i--){
        avgNb += periodSourcesData.nbSources.totalSources[i];
      }
      avgNb /= N;
      avgSourcesDataset.push(avgNb)
    }
  
    const lineData = {
      labels: periodSourcesData.nbSources.date,
      datasets: [
        {
          label: 'Nombre de sources',
          data: periodSourcesData.nbSources.totalSources,
          borderColor: '#ff5174',
          backgroundColor: '#ff5174',
        },
        {
          label: 'Moyenne',
          data: avgSourcesDataset,
          borderColor: '#9da6fb',
          backgroundColor: '#9da6fb',
          pointRadius: 0
        }
      ],
    };

    const lineOptions = {
        maintainAspectRatio : false,
        scales: {
          y: {min: 0}
        },
      };
  
    return <div>
        <Header />
        <div className="h-80 md:h-80 m-1"><Line options={lineOptions} data={lineData} /></div>
      </div>;
  }
  
  export default PeriodSources;