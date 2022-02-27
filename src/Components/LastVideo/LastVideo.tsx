import LastVideoData from "../../Data/LastVideoData";
import SectionTitle from "../Common/SectionTitle";

function LastVideo(data: LastVideoData) {
    return <section className="m-4 lg:w-2/3 lg:mx-auto lg:my-16">
        <SectionTitle title="Dernière vidéo" />
        <div className="shadow-md rounded px-3 text-center lg:p-5 lg:grid lg:grid-cols-4 lg:gap-4">
            <img alt="thumbnail" src={data.thumbnail} className="m-auto rounded" />
            <div className="lg:col-span-3">
                <a href={data.link} rel="external nofollow" title="Ouvrir dans youtube" className="inline-block my-4 text-sm text-gray-700 underline">
                    {data.name}
                </a>
                <p className="mb-3 text-sm text-gray-700 lg:text-left">
                    Publiée le {new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="font-bold mb-3 text-sm text-gray-700 lg:text-left">
                    {data.totalSources === 0
                        ? ('Aucune source citée')
                        : (
                            `${data.totalSources} source${data.totalSources > 1 && ('s')}
                            (${data.totalLinks} lien${data.totalLinks > 1 && ('s')})`
                        )
                    }
                </p>
                <div className="flex flex-wrap justify-evenly md:justify-center lg:justify-start gap-x-1">
                    {data.sources.url.map(link => (
                        <a href={link} rel="external nofollow noreferrer" target="_blank" title={link} key={link} className="rounded-full bg-gray-200 px-2 py-1 my-1 text-xs">
                            {data.sources.common_name[data.sources.url.indexOf(link)]}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </section>;
}

export default LastVideo