import logo from './logo.svg'
import githubMark from './GitHub-Mark.png'
import { NavLink } from "react-router-dom";

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
              <NavLink to="/"
                className={({ isActive }) => {
                  if (isActive) return "p-2 rounded-md text-white bg-gradient-to-r from-purple-400 to-blue-400"
                  else return "p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400"
                }}>Accueil</NavLink>
            </li>
            <li>
            <NavLink to="/search"
                className={({ isActive }) => {
                  if (isActive) return "p-2 rounded-md text-white bg-gradient-to-r from-purple-400 to-blue-400"
                  else return "p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400"
                }}>Recherche</NavLink>
            </li>
            <li>
            <NavLink to="/about"
                className={({ isActive }) => {
                  if (isActive) return "p-2 rounded-md text-white bg-gradient-to-r from-purple-400 to-blue-400"
                  else return "p-2 rounded-md hover:text-white bg-gradient-to-r hover:from-purple-400 hover:to-blue-400"
                }}>À propos</NavLink>
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