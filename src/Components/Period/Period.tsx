import SectionTitle from "../Common/SectionTitle";
import PeriodSources from "./PeriodSources";
import PeriodTop10 from "./PeriodTop10";

function Period() {

  const todayDate = new Date();
  const oneMonthAgoDate = new Date();
  oneMonthAgoDate.setDate(todayDate.getDate() - 30);

  return <section className="m-4 md:w-2/3 md:mx-auto md:my-16">
    <SectionTitle title="Le mois passé" />
    <p className="mb-4 text-sm text-gray-700">
      Les graphiques suivants présentent les sources utilisées au cours des 30 derniers jours (du {oneMonthAgoDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})} au {todayDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}).
    </p>

    <div className="shadow-md rounded md:p-5">
      <PeriodSources />
      <PeriodTop10 />
    </div>
  </section>;

}

export default Period;