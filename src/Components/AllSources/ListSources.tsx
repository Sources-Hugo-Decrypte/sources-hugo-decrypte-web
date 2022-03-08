import { useState, useMemo, useRef } from 'react';
import AllSourcesData from '../../Data/AllSourcesData';
import AllSourcesSingleData from '../../Data/AllSourcesSingleData';

enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

function ListSources({ fetchedData, loading }: { fetchedData: AllSourcesData, loading: boolean }) {

    const listLabels = {
        grade: "Rang",
        name: "Source",
        totalLinks: "Liens",
        percentage: "Part",
        lastDate: "Date"
    };

    const [sourcesData, setSourcesData] = useState<AllSourcesData>([]);

    // Display data when loading is over :
    useMemo(() => {
        setSourcesData(sources => sources = fetchedData);
    }, [fetchedData]);


    // ---------------- Sorting ---------------- //

    const [sortConfig, setSortConfig] = useState({ key: 'grade', direction: SortDirection.ASCENDING });

    const sortArray = (arrayData: AllSourcesData) => {
        // Default, sorted by grade (i.e by number of links) :
        var sorted = [...arrayData].sort((a, b) => {
            if (a['grade'] < b['grade']) {
                return sortConfig.direction === SortDirection.ASCENDING ? -1 : 1;
            }
            if (a['grade'] > b['grade']) {
                return sortConfig.direction === SortDirection.ASCENDING ? 1 : -1;
            }
            return 0;
        });
        // sorting by name :
        if (sortConfig.key === "name") {
            sorted = [...arrayData].sort((a, b) => {
                // a.localeCompare(b) returns -1 if a<b ; 1 if a>b ; 0 if a=b
                if (a['name'].toLowerCase().localeCompare(b['name'].toLowerCase()) === -1) {
                    return sortConfig.direction === SortDirection.ASCENDING ? -1 : 1;
                }
                if (a['name'].toLowerCase().localeCompare(b['name'].toLowerCase()) === 1) {
                    return sortConfig.direction === SortDirection.ASCENDING ? 1 : -1;
                }
                return 0;
            });
        }
        // sorting by date :
        else if (sortConfig.key === "lastDate") {
            sorted = [...arrayData].sort((a, b) => {
                // a.localeCompare(b) returns -1 if a<b ; 1 if a>b ; 0 if a=b
                if (a['lastDate'] < b['lastDate']) {
                    return sortConfig.direction === SortDirection.ASCENDING ? -1 : 1;
                }
                if (a['lastDate'] > b['lastDate']) {
                    return sortConfig.direction === SortDirection.ASCENDING ? 1 : -1;
                }
                return 0;
            });
        }
        setSourcesData(sources => sources = sorted);
    }

    // Automatic sorting when sort configuration is changed :
    useMemo(() => {
        sortArray(sourcesData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortConfig.key, sortConfig.direction]);

    // For sorting in both ways :
    const requestSort = (key: string) => {
        let direction = SortDirection.ASCENDING

        if (sortConfig.key === key && sortConfig.direction === SortDirection.ASCENDING) {
            direction = SortDirection.DESCENDING
        }
        setSortConfig(sortConfig => sortConfig = { key, direction })
    }

    // ---------------- Searching ---------------- //

    const filter = (e: { target: { value: any; }; }) => {
        const keyword = e.target.value;
        let resultsData: AllSourcesData = new Array<AllSourcesSingleData>();
        if (keyword !== '') {
            const results = fetchedData.filter((source) => {
                return source.name.toLowerCase().includes(keyword.toLowerCase());
                // Use the toLowerCase() method to make it case-insensitive
            });
            resultsData = results;
        } else {
            resultsData = fetchedData; // If the text field is empty, show all data
        }
        sortArray(resultsData); // -> keep sorting choice when displaying results
    };


    // ---------------- Design ---------------- //

    // Change arraox design in buttons by changing string in className
    const getClassNamesFor = (key: string): string | undefined => {
        if (sortConfig && sortConfig.key === key) {
            let sortDirectionClass = 'after:text-xs after:ml-1'

            switch (sortConfig.direction) {
                case SortDirection.ASCENDING:
                    sortDirectionClass += " after:content-['▼']"
                    break;
                case SortDirection.DESCENDING:
                    sortDirectionClass += " after:content-['▲']"
                    break;
            }
            return sortDirectionClass
        }
        return undefined
    };

    const refDiv = useRef<HTMLHeadingElement>(null); // -> ref to the div that contains one source data

    // ---------------- Layout ---------------- //

    return (
        <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
            <div>
                {loading
                    ? (
                        <div className="flex flex-row flex-wrap justify-start gap-x-3">
                            <input className="border-2 rounded-full h-max px-3 basis-full mb-2" type="text" placeholder="Chargement..." />
                        </div>
                    ) : (
                        <div className="flex flex-row flex-wrap justify-start gap-x-3 mb-2">
                            <input className="border-2 rounded-full h-max px-3 basis-full mb-2" onChange={filter} type="text" placeholder="Recherche" />
                            <button className={getClassNamesFor('grade') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('grade')}>Rang</button>
                            <button className={getClassNamesFor('name') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('name')}>A-Z</button>
                            <button className={getClassNamesFor('lastDate') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('lastDate')}>Date</button>
                        </div>
                    )}

                {loading ? (<span>TODO: Loading placeholder</span>) : (
                    <>
                        {sourcesData && sourcesData.length > 0 ? (
                            <table className="grid grid-cols-1 md:grid-cols-[minmax(0,_0.5fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] border-2 border-b-0 rounded">
                                <thead className="contents">
                                    <tr className="contents">
                                        <th className="p-3.5 border-r-2 border-b-2">Rang</th>
                                        <th className="p-3.5 overflow-hidden whitespace-nowrap text-ellipsis border-r-2 border-b-2">Source</th>
                                        <th className="p-3.5 overflow-hidden whitespace-nowrap text-ellipsis border-r-2 border-b-2">Liens</th>
                                        <th className="p-3.5 overflow-hidden whitespace-nowrap text-ellipsis border-r-2 border-b-2">Part</th>
                                        <th className="p-3.5 overflow-hidden whitespace-nowrap text-ellipsis border-b-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="contents">
                                    {
                                        sourcesData.map(source => (
                                            <tr className="contents" key={source.name + '-row'}>
                                                <td className="p-3.5 pt-2.5 pb-2.5 overflow-hidden whitespace-nowrap text-center text-ellipsis border-b-2 border-r-2">{source.grade}</td>
                                                <td className="p-3.5 pt-2.5 pb-2.5 overflow-hidden whitespace-nowrap text-ellipsis border-b-2 border-r-2">{source.name}</td>
                                                <td className="p-3.5 pt-2.5 pb-2.5 overflow-hidden whitespace-nowrap text-ellipsis border-b-2 border-r-2">{source.totalLinks}</td>
                                                <td className="p-3.5 pt-2.5 pb-2.5 overflow-hidden whitespace-nowrap text-ellipsis border-b-2 border-r-2">{source.percentage} %</td>
                                                <td className="p-3.5 pt-2.5 pb-2.5 overflow-hidden whitespace-nowrap text-ellipsis border-b-2">{new Date(source.lastDate).toLocaleDateString('fr-FR')}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center border rounded mb-1 p-1">Pas de résultat</div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

export default ListSources;