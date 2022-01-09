import React from 'react';
import githubMark from './GitHub-Mark.png'

function Header() {
  return (
    <header className="py-4 px-2 border-b border-gray-200">
      <div className="flex items-center">
        <img className="inline-block" src="" alt="Sources Hugo Décrypte Logo" />
        <nav className="ml-auto">
          <ul className="flex space-x-6">
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="#">Recherche</a>
            </li>
            <li>
              <a href="#">À propos</a>
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