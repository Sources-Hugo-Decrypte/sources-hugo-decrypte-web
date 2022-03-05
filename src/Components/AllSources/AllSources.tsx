import { useState, useMemo, useEffect } from 'react';
import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from '../../Utils/useFetch';
import SectionTitle from "../Common/SectionTitle";
import "./allsources.css";

function Header() {
    return <div>
        <SectionTitle title="Toutes les sources" />
        <div className="shadow-md rounded m-4 p-4 md:mb-8 md:mx-auto">
            <p>
                Le tableau ci-dessous renseigne l'ensemble des sources utilisées au moins une fois. Le nombre de liens correspond au nombre d'utilisations de la source.
                <br /><br />Plus la source est utilisée, plus elle est en haut du classement. En cas d'égalité, c'est la source qui a été utilisée le plus récemment qui est considérée en premier. La date de la dernière utilisation est indiquée pour chaque source.
            </p>
        </div>
    </div>;
}

function AllSources() {    

    let [fetchedData, loading] = useFetch<AllSourcesData>('/.netlify/functions/allsources');

    const listLabels = {
        grade: "Rang",
        name: "Source",
        totalLinks: "Liens",
        percentage: "Part",
        lastDate: "Date"
    };

    // Display data when loading is over :
    useEffect(() =>{
        setSourcesData(fetchedData);
    }, [fetchedData]);

     // ---------------- Sorting ---------------- //
    const [sourcesData, setSourcesData] = useState<AllSourcesData>([]);
    const sortConfigDefault = { key: 'grade', direction: 'asc' };
    const [sortConfig, setSortConfig] = useState(sortConfigDefault);

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
    }

    useMemo(() => {
        sortArray()
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
            setSourcesData(fetchedData); // If the text field is empty, show all data
        }
        //sortArray(); // -> keep sorting choice when displaying results. ISSUE: so far, it prevents to do any searching
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
        return (<section className="m-4 md:w-2/3 md:mx-auto md:my-16">
            <Header />
            <div className="mx-auto my-4 md:w-min text-center">
                <SectionTitle title="Chargement..." />
            </div>
          </section>)
    }

    return (
    <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
        <Header />
        <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
            <div>
                <div className="grid grid-flow-row md:grid-flow-col auto-cols-min gap-2 p-1">
                    <input className="border-2 rounded-full h-max px-3 mb-2 md:mr-4" onChange={filter} type="text" placeholder="Recherche" />
                    <button className={getClassNamesFor('grade') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('grade')}>Rang</button>
                    <button className={getClassNamesFor('name') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('name')}>A-Z</button>
                    <button className={getClassNamesFor('lastDate') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('lastDate')}>Date</button>
                    
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
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.grade}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p className="w-max md:w-11" key={source.name+"-grade-"+source.grade}>
                                        {source.grade}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.name}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p className="w-max md:w-72" key={source.name+"-name"}>
                                        {source.name}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.totalLinks}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p className="w-max md:w-12" key={source.name+"-totalLinks-"+source.totalLinks}>
                                        {source.totalLinks}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.percentage}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p className="w-max md:w-20 whitespace-pre" key={source.name+"-percentage-"+source.percentage}>
                                        {source.percentage} %
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.lastDate}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p className="w-max md:w-28" key={source.name+"-lastDate-"+source.lastDate}>
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