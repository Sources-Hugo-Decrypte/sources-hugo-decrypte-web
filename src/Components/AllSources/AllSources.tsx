import AllSourcesData from '../../Data/AllSourcesData';
import useFetch from '../../Utils/useFetch';
import SectionTitle from "../Common/SectionTitle";
import ListSources from './ListSources';

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

    return (
    <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
        <Header />
        <ListSources fetchedData={fetchedData} loading={loading} />
    </section>
    );
}

export default AllSources;