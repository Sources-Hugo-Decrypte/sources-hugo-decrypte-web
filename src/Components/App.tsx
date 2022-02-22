import Header from './Header/Header';
import Remark from './Remark/Remark';
import Top10 from './Top10/Top10';
import Footer from './Footer/Footer'
import Overview from './Overview/Overview';
import HomeData from "../Data/HomeData";
import LastVideoData from "../Data/LastVideoData";
import SectionTitle from "./Common/SectionTitle";
import useFetch from "../Utils/useFetch";
import LastVideo from './LastVideo/LastVideo';

function App() {
  const [homeData, loading] = useFetch<HomeData>('/.netlify/functions/home')
  const [lastVideoData, loading2] = useFetch<LastVideoData>('/.netlify/functions/lastvideo')

  if (loading) {
    return (<>
      <Header />
      <Remark />
      <div className="h-screen text-center my-20">
        <SectionTitle title="Chargement..." />
      </div>
      <Footer />
    </>)
  }

  return (
    <>
      <Header />
      <Remark />
      <Overview {...homeData.overview} />
      <LastVideo {...lastVideoData} />
      <Top10 {...homeData.top10} />
      <Footer />
    </>
  );
}

export default App;
