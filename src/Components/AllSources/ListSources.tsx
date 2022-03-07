import { useState, useMemo, useEffect, useRef } from 'react';
import AllSourcesData from '../../Data/AllSourcesData';
import AllSourcesSingleData from '../../Data/AllSourcesSingleData';
import "./allsources.css";
import useWindowDimensions from './useWindowDimensions';

function ListSources({ fetchedData, loading }: {fetchedData: AllSourcesData, loading: boolean}) {

    const listLabels = {
        grade: "Rang",
        name: "Source",
        totalLinks: "Liens",
        percentage: "Part",
        lastDate: "Date"
    };

    const [sourcesData, setSourcesData] = useState<AllSourcesData>([]);

    // Display data when loading is over :
    useMemo(() =>{
        setSourcesData(fetchedData);
    }, [fetchedData]);


    // ---------------- Sorting ---------------- //

    const sortConfigDefault = { key: 'grade', direction: 'asc' };
    const [sortConfig, setSortConfig] = useState(sortConfigDefault);

    const sortArray = (arrayData: AllSourcesData) => {
        // Default, sorted by grade (i.e by number of links) :
        var sorted = [...arrayData].sort((a, b) => {
            if (a['grade'] < b['grade']) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a['grade'] > b['grade']) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        // sorting by name :
        if (sortConfig.key === "name"){
            sorted = [...arrayData].sort((a, b) => {
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
        // sorting by date :
        else if (sortConfig.key === "lastDate"){
            sorted = [...arrayData].sort((a, b) => {
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

    // Automatic sorting when sort configuration is changed :
    useMemo(() => {
        sortArray(sourcesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortConfig.key, sortConfig.direction]);

    // For sorting in both ways :
    const requestSort = (key: string) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key, direction });
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
    const getClassNamesFor = (key: string) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === key ? sortConfig.direction : undefined;
    };

    const refDiv = useRef<HTMLHeadingElement>(null); // -> ref to the div that contains one source data
    
    const { windowWidth } = useWindowDimensions();

    // Default width for every element :
    const sourcesWidthDefault = {
        grade: 44,
        name: 0,
        totalLinks: 48,
        percentage: 80,
        lastDate: 82
    }
    // Adapt size on screen width :
    sourcesWidthDefault.name = windowWidth*2/3 - (sourcesWidthDefault.grade + sourcesWidthDefault.totalLinks + sourcesWidthDefault.percentage + sourcesWidthDefault.lastDate + 16*4 + 2*4 + 16*2 +14);
    // '+16*4' because there is a gap-4 between each element | '+2*4' because of p-1 for grid div
    
    // Create style dictionary :
    const sourcesStyleDefault = {
        grade:{width: `${sourcesWidthDefault.grade}px`},
        name:{width: `${sourcesWidthDefault.name}px`},
        totalLinks:{width: `${sourcesWidthDefault.totalLinks}px`},
        percentage:{width: `${sourcesWidthDefault.percentage}px`},
        lastDate:{width: `${sourcesWidthDefault.lastDate}px`}
    }

    const [sourcesStyle, setSourcesStyle] = useState(sourcesStyleDefault);
    const [sourcesWidth, setSourcesWidth] = useState(sourcesWidthDefault);

    const currentSourcesWidthDefault = sourcesWidth.grade + sourcesWidth.name + sourcesWidth.totalLinks + sourcesWidth.percentage + sourcesWidth.lastDate + 16*4 + 2*4 +2;
    // '+16*4' because there is a gap-4 between each element | '+2*4' because of p-1 for grid div

    const [currentSourcesWidth, setCurrentSourcesWidth] = useState(currentSourcesWidthDefault);
    
    // auto-update sourcesStyle and currentSourcesWidth :
    useEffect(() => {
        setSourcesStyle({
            grade:{width: `${sourcesWidth.grade}px`},
            name:{width: `${sourcesWidth.name}px`},
            totalLinks:{width: `${sourcesWidth.totalLinks}px`},
            percentage:{width: `${sourcesWidth.percentage}px`},
            lastDate:{width: `${sourcesWidth.lastDate}px`}
        });
        setCurrentSourcesWidth(sourcesWidth.grade + sourcesWidth.name + sourcesWidth.totalLinks + sourcesWidth.percentage + sourcesWidth.lastDate + 16*4 +2*4 +2);
    }, [sourcesWidth])

    // update layout when resizing :
    useEffect(() => {
        window.addEventListener("resize", updateSourcesNamesWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateSourcesNamesWidth = () => {
        const newSourcesWidth = {
            grade: sourcesWidth.grade,
            name: sourcesWidth.name,
            totalLinks: sourcesWidth.totalLinks,
            percentage: sourcesWidth.percentage,
            lastDate: sourcesWidth.lastDate
        }
        // Reduce size :
        if(refDiv.current != null && currentSourcesWidth > refDiv.current.offsetWidth){
            newSourcesWidth.name = sourcesWidth.name - (currentSourcesWidth - refDiv.current.offsetWidth);
        }
        // Increase size :
        if(refDiv.current != null && currentSourcesWidth < refDiv.current.offsetWidth){
            newSourcesWidth.name = sourcesWidth.name + (refDiv.current.offsetWidth - currentSourcesWidth);
        }
        setSourcesWidth(newSourcesWidth);
    }


    // ---------------- Layout ---------------- //

    return (
        <div className="shadow-md rounded m-4 p-4 md:my-8 md:mx-auto">
            <div>
                {loading
                ? (
                <div className="grid grid-flow-row md:grid-flow-col auto-cols-min gap-2 p-1">
                    <input className="border-2 rounded-full h-max px-3 mb-2 md:mr-4" type="text" placeholder="Chargement..." />
                </div>
                ) : (
                <div className="grid grid-flow-row md:grid-flow-col auto-cols-min gap-2 p-1">
                    <input className="border-2 rounded-full h-max px-3 mb-2 md:mr-4" onChange={filter} type="text" placeholder="Recherche" />
                    <button className={getClassNamesFor('grade') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('grade')}>Rang</button>
                    <button className={getClassNamesFor('name') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('name')}>A-Z</button>
                    <button className={getClassNamesFor('lastDate') + " bg-gray-100 hover:bg-gray-200 rounded-full h-max w-max px-4 py-1"} onClick={() => requestSort('lastDate')}>Date</button>
                </div>
                )}

                <div className="invisible md:visible font-bold grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 max-h-0 md:max-h-min p-1">
                    <p style={sourcesStyle.grade}>{listLabels.grade}</p>
                    <p style={sourcesStyle.name}>{listLabels.name}</p>
                    <p style={sourcesStyle.totalLinks}>{listLabels.totalLinks}</p>
                    <p style={sourcesStyle.percentage}>{listLabels.percentage}</p>
                    <p style={sourcesStyle.lastDate}>{listLabels.lastDate}</p>
                </div>

                {loading
                // if loading :
                ? (
                <ul className="list">
                    {Array(3).fill(0).map((_, index) => (
                        <li key={index+"-li"}>
                            <div ref={refDiv} className="grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 border rounded mb-1 p-1" key={index+"-div"}>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.grade}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <div style={sourcesStyle.grade} className="h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded" key={index+"-grade-"}></div>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.name}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    {windowWidth <= 768
                                    ? (<div className="w-44 h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded"></div>)
                                    : (<div style={sourcesStyle.name} className="h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded" key={index+"-name"}></div>)}
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.totalLinks}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <div style={sourcesStyle.totalLinks} className=" h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded" key={index+"-totalLinks-"}></div>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.percentage}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <div style={sourcesStyle.percentage} className="h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded" key={index+"-percentage-"}></div>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.lastDate}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <div style={sourcesStyle.lastDate} className="h-2 mt-2 ml-1 md:ml-0 bg-gray-300 rounded" key={index+"-lastDate-"}></div>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                    )
                    // if not loading :
                    : (
                    <ul className="list">
                    {sourcesData && sourcesData.length > 0 ? (
                        sourcesData.map(source => (
                        <li key={source.name+"-li"}>
                            <div ref={refDiv} className="grid grid-flow-row md:grid-flow-col md:auto-cols-min md:gap-4 border rounded mb-1 p-1 hover:bg-gray-50" key={source.name+"-div"}>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.grade}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p style={sourcesStyle.grade} key={source.name+"-grade-"+source.grade}>
                                        {source.grade}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.name}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p style={sourcesStyle.name} className="md:break-words" key={source.name+"-name"}>
                                        {source.name}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.totalLinks}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p style={sourcesStyle.totalLinks} key={source.name+"-totalLinks-"+source.totalLinks}>
                                        {source.totalLinks}
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.percentage}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p style={sourcesStyle.percentage} className="whitespace-pre" key={source.name+"-percentage-"+source.percentage}>
                                        {source.percentage} %
                                    </p>
                                </div>
                                <div className="grid grid-flow-col auto-cols-min w-min">
                                    <p className="w-14 font-bold whitespace-pre md:invisible md:max-w-0">{listLabels.lastDate}</p>
                                    <p className="font-bold whitespace-pre md:invisible md:max-w-0"> : </p>
                                    <p style={sourcesStyle.lastDate} key={source.name+"-lastDate-"+source.lastDate}>
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
                )}
            </div>
        </div>
    )
};

export default ListSources;