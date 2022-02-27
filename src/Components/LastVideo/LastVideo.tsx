import LastVideoData from "../../Data/LastVideoData";
import SectionTitle from "../Common/SectionTitle";

function LastVideo(data: LastVideoData) {
    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
        <SectionTitle title="Dernière vidéo" />
        <div className="shadow-md rounded md:p-5 grid grid-cols-4 gap-4">
            <img alt="thumbnail" src={data.thumbnail} className="my-auto rounded" />
            <div className="col-span-3">
                <a href={data.link} rel="external nofollow" title="Ouvrir dans youtube" className="underline">
                    <p className="mb-1 text-sm text-gray-700">{data.name}</p>
                </a>
                <p className="mb-3 text-sm text-gray-700">
                    Publiée le {new Date(data.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="font-bold mb-3 text-sm text-gray-700">
                    {data.totalSources === 0
                        ? ('Aucune source citée')
                        : (
                            `${data.totalSources} Source${data.totalSources > 1 && ('s')}
                            (${data.totalLinks} lien${data.totalLinks > 1 && ('s')})`
                        )
                    }
                </p>
                <div className="flex flex-wrap justify-start gap-x-1">
                    {data.sources.url.map(link => (
                        <a href={link} rel="external nofollow" title={link} key={link} className="rounded-full bg-gray-200 px-2 py-1 my-1 text-xs">
                            {data.sources.common_name[data.sources.url.indexOf(link)]}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </section>;
}

export default LastVideo