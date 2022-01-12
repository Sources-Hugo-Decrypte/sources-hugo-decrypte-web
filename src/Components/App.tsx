import Header from './Header/Header';
import Remark from "./Remark/Remark";
import Top10 from "./Top10/Top10";



function App() {

  // For now, Top10 raw data is written in hard copy
  const labels = ['lemonde.fr', 'francetvinfo.fr', '20minutes.fr', 'leparisien.fr', 'lefigaro.fr', 'huffingtonpost.fr', 'bfmtv.com', 'ouest-france.fr', 'lci.fr', 'courrierinternational.com'];
  const totalLinks = [895, 732, 330, 314, 306, 260, 229, 229, 203, 178];
  const percentages = [7.56, 6.19, 2.79, 2.65, 2.59, 2.19, 1.94, 1.94, 1.72, 1.5];  

  return (
    <>
      <Header />
      <Remark />
      <Top10 {...{labels, totalLinks, percentages}} />
    </>
  );
}

export default App;
