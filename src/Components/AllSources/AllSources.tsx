import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from "../../Utils/useFetch";
import SectionTitle from "../Common/SectionTitle";
import "./allsources.css";
import List from 'list.js';

function AllSources() {    

    const [data, loading] = useFetch<AllSourcesData>('/.netlify/functions/allsources');

    const grade = "grade";
    const name = "name";
    const nbLinks = "nbLinks";
    const percentage = "percentage";
    const lastDate = "lastDate";

    const listLabels = {
        grade: "Rang",
        name: "Source",
        nbLinks: "Liens",
        percentage: "Part",
        lastDate: "Date"
    };

    var options = {
        valueNames: [grade, name, nbLinks, percentage, lastDate]
      };
      
    new List("sourcesList", options);
    
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
        <p className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
            Le tableau ci-dessous renseigne l'ensemble des sources utilisées au moins une fois. Le nombre de liens correspond au nombre d'utilisations de la source.
            <br /><br />Plus la source est utilisée, plus elle est en haut du classement. En cas d'égalité, c'est la source qui a été utilisée le plus récemment qui est considérée en premier.
        </p>
        <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto max-w-xs md:max-w-min">
            <div id="sourcesList">
                <div className="grid grid-flow-row md:grid-cols-2 auto-cols-min gap-4 p-1">
                    <div>
                        <input className="search border-2 rounded-full px-3 md:mr-2" type="text" placeholder="Recherche" />
                    </div>
                    <div>
                        <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mr-3 mb-3" data-sort={name} data-order="asc">Sources</button>
                        <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mr-3 mb-3" data-sort={grade} data-order="asc">Liens</button>
                        <button className="sort bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mb-3" data-sort={lastDate}>Dates</button>
                    </div>
                </div>

                <div className="invisible md:visible font-bold grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 max-h-0 md:max-h-min p-1">
                    <p className="w-11">{listLabels.grade}</p>
                    <p className="w-72">{listLabels.name}</p>
                    <p className="w-12">{listLabels.nbLinks}</p>
                    <p className="w-20">{listLabels.percentage}</p>
                    <p className="w-32">{listLabels.lastDate}</p>
                </div>

                <ul className="list">
                    {data.labels.map(label => (
                    <li key={label+"-li"}>
                        <div className="grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 border rounded mb-1 p-1" key={label+"-div"}>
                            <div className="grid grid-flow-col auto-cols-min">
                                <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.grade}    : </p>
                                <p className={grade+" w-11"} key={label+grade+data.labels.indexOf(label)}>
                                    {data.labels.indexOf(label)+1}
                                </p>
                            </div>
                            <div className="grid grid-flow-col auto-cols-min">
                                <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.name} : </p>
                                <p className={name+" w-72"} key={label+name}>
                                    {label}
                                </p>
                            </div>
                            <div className="grid grid-flow-col auto-cols-min">
                                <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.nbLinks}    : </p>
                                <p className={nbLinks+" w-12"} key={label+nbLinks+data.totalLinks[data.labels.indexOf(label)]}>
                                    {data.totalLinks[data.labels.indexOf(label)]}
                                </p>
                            </div>
                            <div className="grid grid-flow-col auto-cols-min">
                                <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.percentage}      : </p>
                                <p className={percentage+" w-20"} key={label+percentage+data.percentages[data.labels.indexOf(label)]}>
                                    {data.percentages[data.labels.indexOf(label)]} %
                                </p>
                            </div>
                            <div className="grid grid-flow-col auto-cols-min">
                                <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.lastDate}     : </p>
                                <p className={lastDate+" w-28"} key={label +lastDate+ new Date(data.lastDates[data.labels.indexOf(label)]).toLocaleDateString('fr-FR')}>
                                    {new Date(data.lastDates[data.labels.indexOf(label)]).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
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