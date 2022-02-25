import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from "../../Utils/useFetch";
import SectionTitle from "../Common/SectionTitle";
import List from 'list.js';

function AllSources() {    

    const [data, loading] = useFetch<AllSourcesData>('/.netlify/functions/allsources');

    var options = {
        valueNames: ["grade", "name", "nbLinks", "percentage", "lastDate"]
      };
      
    var sourcesList = new List("sourcesList", options);
    
    /*
    // This function is not accepted to sort Dates. To investigate.
    function sortDate(a: Date,b: Date){
        return new Date(b).getTime() - new Date(a).getTime();
      };
    sourcesList.sort('lastDate', { sortFunction: sortDate });
    */

    if (loading) {
        return (<>
          <div className="h-screen text-center my-20">
            <SectionTitle title="Chargement..." />
          </div>
        </>)
      }
    
    return (
    <section className="m-4 w-min md:mx-auto md:my-16">
        <div className="shadow-md rounded p-5">
            <div id="sourcesList">
                <input className="search border-2 rounded-full px-3 mr-2" placeholder="Recherche" />
                <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mx-2" data-sort="name" data-order="asc">Source</button>
                <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mx-2" data-sort="nbLinks">Liens</button>
                <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mx-2" data-sort="lastDate">Date</button>

                <div className="mt-4 font-bold grid grid-flow-col auto-cols-min gap-4 p-1">
                    <p className="w-11">Rang</p>
                    <p className="w-72">Source</p>
                    <p className="w-12">Liens</p>
                    <p className="w-20">Part</p>
                    <p className="w-32">Denière citation</p>
                </div>

                <ul className="list">
                    {data.labels.map(label => (
                    <li>
                        <div className="grid grid-flow-col auto-cols-min gap-4 border rounded mb-1 p-1">
                            <p className="grade w-11">{data.labels.indexOf(label)+1}</p>
                            <p className="name w-72">{label}</p>
                            <p className="nbLinks w-12">{data.totalLinks[data.labels.indexOf(label)]}</p>
                            <p className="percentage w-20">{data.percentages[data.labels.indexOf(label)]} %</p>
                            <p className="lastDate w-28">{new Date(data.lastDates[data.labels.indexOf(label)]).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
    );
}

export default AllSources;