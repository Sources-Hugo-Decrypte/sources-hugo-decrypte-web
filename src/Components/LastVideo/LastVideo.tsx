import LastVideoData from "../../Data/LastVideoData";
import SectionTitle from "../Common/SectionTitle";
import useFetch from "../../Utils/useFetch";

function LastVideo() {
    const [videoData, loading] = useFetch<LastVideoData>('/.netlify/functions/lastvideo')

    if (loading) {
        return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
            <SectionTitle title="Dernière vidéo" />
            <div className="animate-pulse shadow-md rounded px-3 text-center lg:p-5 lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="rounded m-auto bg-gray-300 w-full h-24 mb-3 lg:mb-0"></div>
                <div className="lg:col-span-3 lg:text-left space-y-6 pb-3 lg:pb-0">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                    <div className="h-2 w-24 bg-gray-300 rounded"></div>
                </div>
            </div>
        </section>;
    }

    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
        <SectionTitle title="Dernière vidéo" />
        <div className="shadow-md rounded px-3 text-center lg:p-5 lg:grid lg:grid-cols-4 lg:gap-4">
            <img alt="thumbnail" src={videoData.thumbnail} className="m-auto rounded" />
            <div className="lg:col-span-3 lg:text-left">
                <a href={videoData.link} rel="external nofollow" title="Ouvrir dans youtube" className="inline-block my-4 text-sm text-gray-700 underline">
                    {videoData.name}
                </a>
                <p className="mb-3 text-sm text-gray-700">
                    Publiée le {new Date(videoData.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="font-bold mb-3 text-sm text-gray-700">
                    {videoData.totalSources === 0
                        ? ('Aucune source citée')
                        : (
                            `${videoData.totalSources} source${videoData.totalSources > 1 && ('s')}
                            (${videoData.totalLinks} lien${videoData.totalLinks > 1 && ('s')})`
                        )
                    }
                </p>
                <div className="flex flex-wrap justify-evenly md:justify-center lg:justify-start gap-x-1">
                    {videoData.sources.map(source => (
                        <a href={source.url} rel="external nofollow noreferrer" target="_blank" title={source.url} key={source.url} className="rounded-full bg-gray-200 px-2 py-1 my-1 text-xs">
                            {source.common_name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </section>;
}

export default LastVideo