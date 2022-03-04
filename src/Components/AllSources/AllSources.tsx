import { useState, useMemo } from 'react';
import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from '../../Utils/useFetch';
import SectionTitle from "../Common/SectionTitle";
import "./allsources.css";

function AllSources() {    

    let [fetchedData, loading] = useFetch<AllSourcesData>('/.netlify/functions/allsources');

    const listLabels = {
        grade: "Rang",
        name: "Source",
        totalLinks: "Liens",
        percentage: "Part",
        lastDate: "Date"
    };

     // ---------------- Sorting ---------------- //
    const [sourcesData, setSourcesData] = useState<AllSourcesData>([]);
    const sortConfigDefault = { key: 'grade', direction: 'asc' };
    const [sortConfig, setSortConfig] = useState(sortConfigDefault);

    useMemo(() => {
        const sortArray = () => {
        // Default, sorted by grade (i.e by number of links) :
        var sorted = [...sourcesData].sort((a, b) => {
            if (a['grade'] < b['grade']) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a['grade'] > b['grade']) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        if (sortConfig.key === "name"){
            sorted = [...sourcesData].sort((a, b) => {
                // a.localeCompare(b) returns -1 if a<b ; 1 if a>b ; 0 if a=b
                if (a['name'].toLowerCase().localeCompare(b['name'].toLowerCase()) === -1) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a['name'].toLowerCase().localeCompare(b['name'].toLowerCase()) === 1) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        else if (sortConfig.key === "lastDate"){
            sorted = [...sourcesData].sort((a, b) => {
                // a.localeCompare(b) returns -1 if a<b ; 1 if a>b ; 0 if a=b
                if (a['lastDate'] < b['lastDate']) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a['lastDate'] > b['lastDate']) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        setSourcesData(sorted);
        };
        sortArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortConfig.key, sortConfig.direction]);

    // ---------------- Searching ---------------- //
    const filter = (e: { target: { value: any; }; }) => {
        const keyword = e.target.value;
        if (keyword !== '') {
        const results = fetchedData.filter((source) => {
            return source.name.toLowerCase().includes(keyword.toLowerCase());
            // Use the toLowerCase() method to make it case-insensitive
        });
        setSourcesData(results);
        } else {
        setSourcesData(fetchedData);
        // If the text field is empty, show all users
        }
    };

    // ---------------- For sorting in both ways ---------------- //
    const requestSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
    }

    // ---------------- Design ---------------- //
    const getClassNamesFor = (key: string) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === key ? sortConfig.direction : undefined;
    };
    
    if (loading) {
        return (<>
          <div className="h-screen text-center my-20">
            <SectionTitle title="Chargement..." />
          </div>
        </>)
    }

    return (
    <section className="m-4 w-min md:mx-auto md:my-16">
        <SectionTitle title="Toutes les sources" />
        <div className="shadow-md rounded m-4 p-4 md:mb-8 md:mx-auto">
            <p>
                Le tableau ci-dessous renseigne l'ensemble des sources utilisées au moins une fois. Le nombre de liens correspond au nombre d'utilisations de la source.
                <br /><br />Plus la source est utilisée, plus elle est en haut du classement. En cas d'égalité, c'est la source qui a été utilisée le plus récemment qui est considérée en premier. La date de la dernière utilisation est indiquée pour chaque source.
            </p>
            <button className="border-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 mt-8" onClick={() => setSourcesData(fetchedData)}>Charger les données</button>
        </div>
        <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto max-w-xs md:max-w-min">
            <div>
                <div className="grid grid-flow-row md:grid-cols-2 auto-cols-min gap-4 p-1">
                    <div>
                        <input className="border-2 rounded-full px-3 md:mr-2" onChange={filter} type="text" placeholder="Recherche" />
                    </div>
                    <div>
                        <button className={getClassNamesFor('grade') + " bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mr-3 mb-3"} onClick={() => requestSort('grade')}>Rang</button>
                        <button className={getClassNamesFor('name') + " bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mr-3 mb-3"} onClick={() => requestSort('name')}>A-Z</button>
                        <button className={getClassNamesFor('lastDate') + " bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 mr-3 mb-3"} onClick={() => requestSort('lastDate')}>Date</button>
                    </div>
                </div>

                <div className="invisible md:visible font-bold grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 max-h-0 md:max-h-min p-1">
                    <p className="w-11">{listLabels.grade}</p>
                    <p className="w-72">{listLabels.name}</p>
                    <p className="w-12">{listLabels.totalLinks}</p>
                    <p className="w-20">{listLabels.percentage}</p>
                    <p className="w-32">{listLabels.lastDate}</p>
                </div>

                <ul className="list">
                    {sourcesData && sourcesData.length > 0 ? (
                        sourcesData.map(source => (
                        <li key={source.name+"-li"}>
                            <div className="grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 border rounded mb-1 p-1" key={source.name+"-div"}>
                                <div className="grid grid-flow-col auto-cols-min">
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.grade}    : </p>
                                    <p className="w-11" key={source.name+"-grade-"+source.grade}>
                                        {source.grade}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min">
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.name} : </p>
                                    <p className="w-72" key={source.name+"-name"}>
                                        {source.name}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min">
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.totalLinks}    : </p>
                                    <p className="w-12" key={source.name+"-totalLinks-"+source.totalLinks}>
                                        {source.totalLinks}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min">
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.percentage}      : </p>
                                    <p className="w-20" key={source.name+"-percentage-"+source.percentage}>
                                        {source.percentage} %
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min">
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.lastDate}     : </p>
                                    <p className="w-28" key={source.name+"-lastDate-"+source.lastDate}>
                                        {new Date(source.lastDate).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        </li>
                        ))
                    ) : (
                        <div className="text-center border rounded mb-1 p-1">Pas de résultat</div>
                    )}
                </ul>
            </div>
        </div>
    </section>
    );
}

export default AllSources;