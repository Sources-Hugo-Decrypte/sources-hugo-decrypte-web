import Remark from '../Remark/Remark';
import Top10 from '../Top10/Top10';
import Overview from '../Overview/Overview';
import HomeData from "../../Data/HomeData";
import SectionTitle from "../Common/SectionTitle";
import useFetch from "../../Utils/useFetch";

function Home() {
  const [homeData, loading] = useFetch<HomeData>('/.netlify/functions/home')

  if (loading) {
    return (<>
      <Remark />
      <div className="h-screen text-center my-20">
        <SectionTitle title="Chargement..." />
      </div>
    </>)
  }

  return (
    <>
      <Remark />
      <Overview {...homeData.overview} />
      <Top10 {...homeData.top10} />
    </>
  );
}

export default Home;
