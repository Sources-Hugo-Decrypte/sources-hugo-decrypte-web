import Remark from '../Remark/Remark';
import Top10 from '../Top10/Top10';
import Overview from '../Overview/Overview';
import LastVideo from "../LastVideo/LastVideo";
import Period from '../Period/Period';

function Home() {

  return (
    <>
      <Remark />
      <Overview />
      <LastVideo />
      <Top10 />
      <Period />
    </>
  );
}

export default Home;
