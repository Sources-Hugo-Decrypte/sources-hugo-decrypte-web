import { ExternalLinkIcon } from '@heroicons/react/outline'

function About() {

  const picThomas = "https://avatars.githubusercontent.com/u/17292890";
  const picYouen = "https://avatars.githubusercontent.com/u/75084658";

  const extLinkIncon = <ExternalLinkIcon className="h-4 w-4" />;

  return (
    <div className="m-4 p-4 md:mx-auto md:my-4 md:w-1/2">
      <p className="shadow-md rounded p-5 my-8">
        <p className="font-bold text-lg mb-2">À propos</p>
        Ce site a pour but de fournir des statistiques sur les sources utilisées par Hugo Décrypte dans sa chaîne youtube <a className="underline" href="https://www.youtube.com/c/HugoD%C3%A9crypte" rel="external nofollow">Hugo Décrypte - Actus du Jour</a>, qui présente des vidéos sur l'actualité.
        <br /><br />Nous souhaitons donner des outils et des pistes de réflexion à toutes celles et ceux qui se questionnent sur la neutralité des propos d'Hugo Décrypte.
        <br /><br />Nous ne sommes pas rattachés à Hugo Décrypte et nous présentons ces données en nous efforçant d'être le plus impartial possible.
      </p>
      <div className="shadow-md rounded p-2 md:p-5 my-8 lg:grid grid-cols-2 gap-4">
        <p className="mb-4 md:mb-0 col-span-2 font-bold text-lg">Qui sommes-nous ?</p>
        <div className="p-2 md:p-5 flex flex-col items-center">
          <img className="rounded-full w-52 md:w-60" alt="Thomas" src={picThomas} />
          <p className="text-center my-4">Thomas Couacault</p>
          <p className="text-justify my-2">Logoden biniou degemer mat an penn ar bed diwezh, Mur Doue kelenner war gazek aotre kerzhout Roazhon Park koulz, echuiñ Kemperle gar mab kurun klask pelec’h.</p>
          <div className="flex md:items-center">
          <a className="underline mb-7 md:mb-0" href="https://www.linkedin.com/in/thomas-couacault/" rel="external nofollow">Linkedin</a>
            {extLinkIncon}
          </div>
        </div>
        <div className="p-2 md:p-5 flex flex-col items-center">
          <img className="rounded-full w-52 md:w-60" alt="Youen" src={picYouen} />
          <p className="text-center my-4">Youën Ruaux</p>
          <p className="text-justify my-2">Logoden biniou degemer mat an penn ar bed diwezh, Mur Doue kelenner war gazek aotre kerzhout Roazhon Park koulz, echuiñ Kemperle gar mab kurun klask pelec’h.</p>
          <div className="flex md:items-center">
            <a className="underline" href="https://www.linkedin.com/in/profile-yrx/" rel="external nofollow">Linkedin</a>
            {extLinkIncon}
          </div>
        </div>
      </div>
      <p className="shadow-md rounded p-5 my-8">
        <p className="font-bold text-lg mb-2">Remerciements</p>
        Nous adressons des remerciements à l'ensemble de la comunauté open source, sans laquelle ce projet n'aurait jamais vu le jour. 😉
        <br /><br />Le code source est en accès libre <a className="underline" href="https://github.com/Sources-Hugo-Decrypte/" rel="external nofollow" title="Voir les sources sur GitHub">ici</a>.
      </p>
    </div>
  );
}

export default About;