import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from "../../Utils/useFetch";
import SectionTitle from "../Common/SectionTitle";
//import List from 'list.js';

function AllSources() {    

    const [data, loading] = useFetch<AllSourcesData>('/.netlify/functions/allsources');

    if (loading) {
        return (<>
          <div className="h-screen text-center my-20">
            <SectionTitle title="Chargement..." />
          </div>
        </>)
      }

    return (
    <section className="m-4 md:w-3/4 lg:w-2/3 md:mx-auto md:my-16">
        <div className="shadow-md rounded p-5">
            <table className="table-auto min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr className="divide-x">
                        <th className="p-2">Rang</th>
                        <th>Source</th>
                        <th>Nombre de liens</th>
                        <th>Part de l'ensemble des liens</th>
                        <th>Date de la dernière citation</th>
                    </tr>
                </thead>
                <tbody className="odd:bg-white even:bg-slate-100 bg-white divide-y divide-gray-200">
                    {data.labels.map(label => (
                        <tr className="text-center border-b divide-x odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                            key={label+"-row"}>
                            <td className="p-1" key={label+"-index-"+data.labels.indexOf(label)}>
                                {data.labels.indexOf(label)+1}
                            </td>
                            <td key={label}>
                                {label}
                            </td>
                            <td key={label+"-totalLinks-"+data.totalLinks[data.labels.indexOf(label)]}>
                                {data.totalLinks[data.labels.indexOf(label)]}
                            </td>
                            <td key={label+"-percentage-"+data.percentages[data.labels.indexOf(label)]}>
                                {data.percentages[data.labels.indexOf(label)]} %
                            </td>
                            <td key={label +"-lastDate-"+ new Date(data.lastDates[data.labels.indexOf(label)]).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}>
                                {new Date(data.lastDates[data.labels.indexOf(label)]).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
    );
}

export default AllSources;