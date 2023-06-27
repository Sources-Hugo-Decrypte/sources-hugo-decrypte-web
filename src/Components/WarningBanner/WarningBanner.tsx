function WarningBanner() {
    return <div className="flex flex-col text-center w-screen p-3 bg-[#F7D456]">
        <p>Ce site n'est plus mis à jour. Les données restent toutefois consultables.</p>
        <p className="text-sm">En raison des limitations de la base de données utilisée comme archive, veuillez réactualiser la page si certaines informations ne s'affichent pas correctement.</p>
    </div>
}

export default WarningBanner