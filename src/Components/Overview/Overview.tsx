import OverviewData from '../../Data/OverviewData'
import SectionTitle from '../Common/SectionTitle'
import { VideoCameraIcon, NewspaperIcon, LinkIcon } from '@heroicons/react/outline'
import React from "react"
import useFetch from '../../Utils/useFetch'

function OverviewItem({ value, title, description, icon, loading = false }: { value: number, title: string, description: string | React.ReactNode, icon?: React.ReactNode, loading?: boolean }) {
    return <div className="w-64">
        <div className="flex md:items-center">
            {loading ? <div className="animate-pulse h-2 w-8 mr-2 my-auto bg-gray-300 rounded"></div>
                : <h3 className="font-bold text-3xl mr-1">{value}</h3>}
            {icon}
        </div>
        <h5 className="font-bold my-2">{title}</h5>
        <p className="text-sm">{description}</p>
    </div>
}

function Overview() {
    const { data: overviewData, isLoading, error } = useFetch<OverviewData>('/.netlify/functions/overview');

    if (error) {
        console.error(error)
    }

    return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
        <SectionTitle title="En bref" />
        <div className="shadow-md rounded p-5 flex flex-col md:flex-row md:justify-around gap-10">
            <OverviewItem value={overviewData.totalVideos} title="Vidéos" description="Nombre total de vidéos sur la chaîne Hugo Décrypte - Actus du Jour." icon={<VideoCameraIcon className="h-8 w-8" />} loading={isLoading} />
            <OverviewItem value={overviewData.totalSources} title="Sources" description={<>Nombre total des sources citées.<br /> (Exemple: lemonde.fr, francetvinfo.fr, ...)</>} icon={<NewspaperIcon className="h-7 w-7" />} loading={isLoading} />
            <OverviewItem value={overviewData.totalLinks} title="Liens" description="Nombre total de liens renseignés toutes sources confondues." icon={<LinkIcon className="h-6 w-6" />} loading={isLoading} />
        </div>
    </section>
}

export default Overview