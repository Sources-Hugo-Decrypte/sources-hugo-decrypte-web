import { useState, useMemo } from 'react';
import AllSourcesData from '../../Data/AllSourcesData';
import AllSourcesSingleData from '../../Data/AllSourcesSingleData';
import { CalendarIcon, LinkIcon, NewspaperIcon } from '@heroicons/react/outline'

enum SortDirection {
    ASCENDING = 'asc',
    DESCENDING = 'desc'
}

function ListSources({ fetchedData, loading }: { fetchedData: AllSourcesData, loading: boolean }) {

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
                        <div className="flex flex-row flex-wrap justify-start gap-x-3 mb-6">
                            <input className="border-2 rounded-full h-max px-3 basis-full mb-4 sm:max-w-max" onChange={filter} type="text" placeholder="Recherche" />
                            <button className={getClassNamesFor('grade') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('grade')}>Rang</button>
                            <button className={getClassNamesFor('name') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('name')}>A-Z</button>
                            <button className={getClassNamesFor('lastDate') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max px-4 py-1"} onClick={() => requestSort('lastDate')}><CalendarIcon className="w-6 h-5 align-text-top inline" /> Date</button>
                        </div>
                    )}

                {loading ? (<span>TODO: Loading placeholder</span>) : (
                    <>
                        {sourcesData && sourcesData.length > 0 ? (
                            <table className="grid grid-cols-1 sm:grid-cols-[minmax(0,_0.5fr)_minmax(0,_2.5fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] text-justify sm:border-b-0 rounded">
                                <thead className="hidden sm:contents">
                                    <tr className="sm:contents">
                                        <th className="p-2.5 pl-0">Rang</th>
                                        <th className="p-2.5 pl-0 overflow-hidden whitespace-nowrap text-ellipsis">Source <NewspaperIcon className="w-6 h-5 align-text-top inline" /></th>
                                        <th className="p-2.5 pl-0 overflow-hidden whitespace-nowrap text-ellipsis">Liens <LinkIcon className="w-5 h-5 align-text-top inline" /></th>
                                        <th className="p-2.5 pl-0 overflow-hidden whitespace-nowrap text-ellipsis">Part</th>
                                        <th className="p-2.5 pl-0 overflow-hidden whitespace-nowrap text-ellipsis">Date <CalendarIcon className="w-5 h-5 align-text-top inline" /></th>                                    </tr>
                                </thead>
                                <tbody className="sm:contents">
                                    {
                                        sourcesData.map(source => (
                                            <tr className="grid grid-cols-5 mb-4 sm:text-justify sm:contents group" key={source.name + '-row'}>
                                                <td className="col-span-1 ml-2 mt-2 text-center my-auto border-black border-2 rounded sm:rounded-none sm:rounded-l overflow-hidden whitespace-nowrap text-ellipsis font-bold sm:m-0 sm:pt-1 sm:pl-2 sm:border-none sm:text-justify sm:group-odd:bg-gray-100">{source.grade}</td>
                                                <td className="col-span-4 pt-3 pl-2 sm:whitespace-nowrap font-bold text-lg sm:text-base sm:col-span-1 sm:p-0 sm:py-1 sm:font-normal sm:group-odd:bg-gray-100">{source.name}</td>
                                                <td className="col-span-full pl-1.5 py-2 overflow-hidden whitespace-nowrap text-ellipsis sm:col-span-1 sm:p-0 sm:py-1 sm:pl-1 sm:group-odd:bg-gray-100"><LinkIcon className="w-4 h-4 sm:hidden inline-block" /> {source.totalLinks} <span className="sm:hidden">lien{source.totalLinks > 1 && <>s</>} ({source.percentage} % de l'ensemble)</span></td>
                                                <td className="hidden overflow-hidden whitespace-nowrap text-ellipsis col-span-1 py-1 sm:block sm:group-odd:bg-gray-100">{source.percentage} %</td>
                                                <td className="col-span-full pl-1.5 py-2 rounded-r overflow-hidden whitespace-nowrap text-ellipsis sm:col-span-1 sm:p-0 sm:py-1 -mt-1 sm:-mt-0 sm:group-odd:bg-gray-100"> <CalendarIcon className="w-4 h-4 sm:hidden inline-block" /> {new Date(source.lastDate).toLocaleDateString('fr-FR')}</td>
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