import './App.css'
import { useState } from "react";

function App() {

  const [reveils, setReveils] = useState([
    {
      id: 1,
      nom: "Sieste courte",
      dureeMinutes: 10,
      actif: false,
      heureDeFin: null
    },
    {
      id: 2,
      nom: "Sieste moyenne",
      dureeMinutes: 20,
      actif: false,
      heureDeFin: null
    },
    {
      id: 3,
      nom: "Sieste un peu longue",
      dureeMinutes: 30,
      actif: false,
      heureDeFin: null
    }
  ]);

  const [reveilSelectionne, setReveilSelectionne] = useState(null);
  const [nomModified, setNomModified] = useState("");
  const [dureeModified, setDureeModified] = useState("");
  const [modePopup, setModePopup] = useState(null);

  function boutonReveil(idReveil) {
    setReveils(
      reveils.map((ceReveil) => {
        if (ceReveil.id === idReveil) {
          return { ...ceReveil, actif: !ceReveil.actif };
        }

        return ceReveil;
      })
    );
  }

  function selectionnerReveil(reveil) {
    setModePopup("modification")
    setReveilSelectionne(reveil)
    setNomModified(reveil.nom)
    setDureeModified(reveil.dureeMinutes)
  }

  function modifierReveil() {
    if (isNaN(Number(dureeModified)) || Number(dureeModified) <= 0) {
      alert("La durée d'un réveil doit être de minimum 1 minute!")
    } else {
      setReveils(
        reveils.map((ceReveil) => {
      if(ceReveil.id===reveilSelectionne.id){
        return { ...ceReveil, nom: nomModified, dureeMinutes: Number(dureeModified) };
      }
      return ceReveil
        })
      );
    setReveilSelectionne(null)
    }
  }

  function creerReveil() {
    setModePopup("creation")
    setReveilSelectionne(null)
    setNomModified("")
    setDureeModified("")
  }
  
  return (
    <>
      <h1 className="titre">
        nAPPing
      </h1>
      <div className="cardContainer">
        <div className="cardAddReveil">
          <button onClick={creerReveil}>
            Ajouter un réveil
          </button>
        </div >
        {
          reveils.map((ceReveil) => (
            <li key={ceReveil.id} className="cardReveil" onClick={() => selectionnerReveil(ceReveil)}>
              <p className="nomReveil">{ceReveil.nom}</p>
              <p className="dureeReveil">{Math.floor(ceReveil.dureeMinutes / 60).toString().padStart(2, "0")} : {(ceReveil.dureeMinutes % 60).toString().padStart(2, "0")}</p>
              <button className="statutReveil" onClick={(event) => { event.stopPropagation(), boutonReveil(ceReveil.id) }}>
                <span className={"switchBackground" + " " + (ceReveil.actif ? "switchBackgroundOn" : "switchBackgroundOff")}>
                  <span className={"switchRond" + " " + (ceReveil.actif ? "switchRondOn" : "switchRondOff")}>

                  </span>
                </span>
              </button>

            </li>
          ))}
      </div >
      {modePopup && (<div className="popupOverlay">
        <div className="popupReveil">
          <h1>{modePopup === "creation" ? "Créer un réveil" : "Modifier un réveil"}</h1>
          
          <p>Nom : </p>
          <input type="text" value={nomModified} onChange={(event) => setNomModified(event.target.value)}/>
          
          <p>Durée : </p>
          <input type="number" value={dureeModified} onChange={(event) => setDureeModified(event.target.value)}/>
          <button onClick={() => setReveilSelectionne(null)}>Fermer</button>
          
          <button onClick={modifierReveil}>Enregistrer</button>
        </div>
      </div>)}
    </>

  )
}

export default App
