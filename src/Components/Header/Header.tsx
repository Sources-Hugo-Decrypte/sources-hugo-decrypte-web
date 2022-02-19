import logo from './logo.svg'
import githubMark from './GitHub-Mark.png'

function Header() {
  return (
    <header className="p-2 border-b border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center">
        <a href="/">
          <img className="inline-block h-12" src={logo} alt="Sources Hugo Décrypte Logo" />
        </a>
        <nav className="md:ml-auto">
          <ul className="flex justify-around mt-2 md:mt-0 md:space-x-6">
            <li>
              <a href="/" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">Accueil</a>
            </li>
            <li>
              <a href="/" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">Recherche</a>
            </li>
            <li>
              <a href="/about" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">À propos</a>
            </li>
            <li className="md:hidden">
              <a href="https://github.com/Sources-Hugo-Decrypte/" rel="external nofollow" title="Voir les sources sur GitHub">
                <img src={githubMark} alt="Github Mark" className="h-6 w-6" />
              </a>
            </li>
          </ul>
        </nav>
        <div className="border-l border-gray-200 hidden md:block md:ml-4 md:pl-4">
          <a href="https://github.com/Sources-Hugo-Decrypte/" rel="external nofollow" title="Voir les sources sur GitHub">
            <img src={githubMark} alt="Github Mark" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;