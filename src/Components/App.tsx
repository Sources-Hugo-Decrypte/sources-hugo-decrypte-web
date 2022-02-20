import Header from './Header/Header';
import Remark from './Remark/Remark';
import Top10 from './Top10/Top10';
import Period from './Period/Period';
import Footer from './Footer/Footer';
import Overview from './Overview/Overview';
import HomeData from "../Data/HomeData";
import PeriodData from "../Data/PeriodData";
import SectionTitle from "./Common/SectionTitle";
import useFetch from "../Utils/useFetch";

function App() {
  const [homeData, loading] = useFetch<HomeData>('/.netlify/functions/home')
  const [periodData, loading2] = useFetch<PeriodData>('/.netlify/functions/period')

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
      <Top10 {...homeData.top10} />
      <Period {...periodData} />
      <Footer />
    </>
  );
}

export default App;
