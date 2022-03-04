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
  import Top10Data from "../../Data/Top10Data";
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
    return <p className="m-4 text-sm font-bold text-gray-700">Top 10 sur cette période :</p>
  }
  
  function PeriodTop10() {
  
    const [periodTop10Data, loading] = useFetch<Top10Data>('/.netlify/functions/periodtop10');

    const barOptions = {
      maintainAspectRatio : false,
      indexAxis: 'y' as const,
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }

    // Data for waiting animation :
    const periodTop10DataWaiting: Top10Data = {
      labels: Array(10).fill("chargement"),
      totalLinks: [950, 810, 680, 520, 410, 350, 310, 270, 240, 209],
      percentages: Array(10).fill(0)
    }
    const barDataWaiting = {
      labels: periodTop10DataWaiting.labels,
      datasets: [
        {
          label: 'Nombre de liens',
          data: periodTop10DataWaiting.labels.map((_label, index) => periodTop10DataWaiting.totalLinks[index]),
          borderColor: '#d1d5db',
          borderRadius: 4,
          backgroundColor: '#d1d5db',
        }
      ]
    }
    // Waiting animation :
    if(loading){
      return <div>
        <Header />
        <div className="animate-pulse h-72 md:h-96 m-1"><Bar options={barOptions} data={barDataWaiting} /></div>
      </div>;
    }
  

    // Real data :
    const barData = {
      labels: periodTop10Data.labels,
      datasets: [
        {
          label: 'Nombre de liens',
          data: periodTop10Data.labels.map((_label, index) => periodTop10Data.totalLinks[index]),
          borderColor: '#ff6384',
          borderRadius: 4,
          backgroundColor: '#ff91a7',
        }
      ]
    }
  
    return <div>
        <Header />
        <div className="h-72 md:h-96 m-1"><Bar options={barOptions} data={barData} /></div>
      </div>;
  }
  
  export default PeriodTop10;