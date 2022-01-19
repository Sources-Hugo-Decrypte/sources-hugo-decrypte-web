import logo from './logo.png'
import githubMark from './GitHub-Mark.png'

function Header() {
  return (
    <header className="p-2 border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <img className="inline-block w-36 rounded" src={logo} alt="Sources Hugo Décrypte Logo" />
        <nav className="ml-auto">
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">Accueil</a>
            </li>
            <li>
              <a href="/" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">Recherche</a>
            </li>
            <li>
              <a href="/" className="p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400">À propos</a>
            </li>
          </ul>
        </nav>
        <div className="border-l border-gray-200 ml-4 pl-4">
          <a href="https://github.com/Sources-Hugo-Decrypte/sources-hugo-decrypte-web" rel="external nofollow" title="Voir les sources sur GitHub">
            <img src={githubMark} alt="Github Mark" className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;