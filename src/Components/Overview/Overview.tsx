import OverviewData from '../../Data/OverviewData'
import SectionTitle from '../Common/SectionTitle'

function OverviewItem({value, title, description}: {value: number, title: string, description: string}) {
    return <div className="max-w-xs">
        <h3 className="font-bold text-3xl">{value}</h3>
        <h5 className="font-bold my-2">{title}</h5>
        <p className="text-sm">{description}</p>
    </div>
}

function Overview(test: OverviewData) {
    return <section className="w-2/3 mx-auto my-16">
        <SectionTitle title="En bref"/>
        <div className="shadow-md rounded p-5 flex justify-around">
            <OverviewItem value={test.totalVideos} title="Vidéos" description="Nombre total de vidéos sur la chaîne Hugo Décrypte - Actus du Jour." />
            <OverviewItem value={test.totalSources} title="Sources" description="Nombre total des sources citées. Exemple: lemonde.fr compte pour 1." />
            <OverviewItem value={test.totalLinks} title="Liens" description="Nombre total de liens renseignés." />
        </div>        
    </section>
}

export default Overview