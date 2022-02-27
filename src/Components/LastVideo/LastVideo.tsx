import LastVideoData from "../../Data/LastVideoData";
import SectionTitle from "../Common/SectionTitle";

function LastVideo(videoData: LastVideoData) {
    return <section className="m-4 lg:w-2/3 lg:mx-auto lg:my-16">
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