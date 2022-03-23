import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import AllSourcesData from "../../Data/AllSourcesData";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function ChartSources({ fetchedData, loading }: { fetchedData: AllSourcesData, loading: boolean }) {

    const nbValuesLoading = 30;
    let chartValuesLoading = new Array<number>();
    for(let i=0; i<nbValuesLoading; i++){ chartValuesLoading[i] = Math.round(i*1.618); }
    const doughnutDataLoading = {
        labels: Array<string>(nbValuesLoading).fill("chargement"),
        datasets: [
            {
                label: 'Dataset',
                data: chartValuesLoading,
                backgroundColor: '#d1d5db',
            }
        ]
    };

    const doughnutOptions = {
        plugins: {
            legend: {
                display: false
            }
        },
    };

    if(loading) {
        return <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
            <p>Chargement...</p>
            <Doughnut className="animate-pulse max-h-72 m-1" options={doughnutOptions} data={doughnutDataLoading} />
        </div>
    }

    let chartLabels = new Array<string>();
    let chartValues = new Array<number>();
    let nbTotalLinks = 0;
    fetchedData.forEach(source => {
        chartLabels.unshift(source.name)
        chartValues.unshift(source.totalLinks)
        nbTotalLinks += source.totalLinks
    })

    const doughnutData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Dataset',
                data: chartValues,
                backgroundColor: '#9da6fb',
            }
        ]
    };

    // Inner text:
    let innerText = "Total: "+nbTotalLinks;
    const plugins = [{
        id: 'beforeDrawId',
        beforeDraw: function(chart: { width: any; height: any; ctx: any; }) {
            var width = chart.width;
            var height = chart.height-18;
            var ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 220).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "top";
            var text = innerText;
            var textX = Math.round((width - ctx.measureText(text).width) / 2);
            var textY = height / 2;
            ctx.fillText(text, textX, textY);
            ctx.save();
        } 
    }]

    // wierd: if there is the same amount of elements present in 'loading' display, innerText doesn't appear (that's why there is <p></p> here)
    return (
    <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
        <p className="mb-4">Répartition de l'ensemble des sources utilisées, en fonction du nombre de liens par source :</p>
        <p></p>
        <Doughnut className="max-h-72 max-w-72 m-1" options={doughnutOptions} data={doughnutData} plugins={plugins} />
    </div>);
}

export default ChartSources;