import React from 'react';

function Header() {
  return (
    <header className="py-4 px-2 flex justify-between">
        <img className="inline-block" src="" alt="Sources Hugo Décrypte Logo"/>
        <nav className="flex justify-around">
            <a href="#" className="mx-2">Accueil</a>
            <a href="#" className="mx-2">Recherche</a>
            <a href="#" className="mx-2">À propos</a>
        </nav>
    </header>
  );
}

export default Header;