import './App.css'
import { useState, useEffect, useRef } from "react";
import sonnerie from "./sonneriereveil.mp3";

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
  const [tick, setTick] = useState(0);

  const audioRef = useRef(new Audio(sonnerie));

  useEffect(() => {
    audioRef.current.loop = true;
  }, []);

  const sonEnCours = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function boutonReveil(idReveil) {
    setReveils(
      reveils.map((ceReveil) => {
        if (ceReveil.id === idReveil) {

          if (!ceReveil.actif) {
            return {
              ...ceReveil,
              actif: true,
              heureDeFin: Date.now() + ceReveil.dureeMinutes * 60 * 1000
            };
          } else {

            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            sonEnCours.current = false;

            return {
              ...ceReveil,
              actif: false,
              heureDeFin: null
            };
          }
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
          if (ceReveil.id === reveilSelectionne.id) {
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

  function validerPopup() {
    if (modePopup === "modification") {
      modifierReveil();
      resetPopup()
    } else if (modePopup === "creation") {
      const newReveil = {
        id: Date.now(),
        nom: nomModified,
        dureeMinutes: Number(dureeModified),
        actif: false,
        heureDeFin: null
      }
      setReveils([...reveils, newReveil])
      resetPopup()
    }
  }

  function resetPopup() {
    setModePopup(null);
    setReveilSelectionne(null);
    setNomModified("");
    setDureeModified("");
  }

  function toggleTimer(id) {

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
        </div>

        {
          reveils.map((ceReveil) => (
            <li
              key={ceReveil.id}
              className="cardReveil"
              onClick={() => selectionnerReveil(ceReveil)}
            >
              <p className="nomReveil">{ceReveil.nom}</p>

              <p className="dureeReveil">
                {Math.floor(ceReveil.dureeMinutes / 60).toString().padStart(2, "0")} :
                {(ceReveil.dureeMinutes % 60).toString().padStart(2, "0")}
              </p>

              <p className="timerReveil">
                {ceReveil.actif && ceReveil.heureDeFin
                  ? (() => {
                    const remaining = ceReveil.heureDeFin - Date.now();

                    if (remaining <= 0) {
                      if (!sonEnCours.current) {
                        audioRef.current.play();
                        sonEnCours.current = true;
                      }
                      return "00:00";
                    }
                    const totalSeconds = Math.floor(remaining / 1000)
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const secondes = totalSeconds % 60

                    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;
                  })()
                  : ""}
              </p>

              <button
                className="statutReveil"
                onClick={(event) => {
                  event.stopPropagation();
                  boutonReveil(ceReveil.id);
                }}
              >
                <span className={
                  "switchBackground " +
                  (ceReveil.actif ? "switchBackgroundOn" : "switchBackgroundOff")
                }>
                  <span className={
                    "switchRond " +
                    (ceReveil.actif ? "switchRondOn" : "switchRondOff")
                  } />
                </span>
              </button>

            </li>
          ))
        }

      </div>

      {modePopup && (
        <div className="popupOverlay">
          <div className="popupReveil">

            <h1>
              {modePopup === "creation"
                ? "Créer un réveil"
                : "Modifier un réveil"}
            </h1>

            <p>Nom :</p>
            <input
              type="text"
              value={nomModified}
              onChange={(event) => setNomModified(event.target.value)}
            />

            <p>Durée :</p>
            <input
              type="number"
              value={dureeModified}
              onChange={(event) => setDureeModified(event.target.value)}
            />

            <button onClick={() => resetPopup()}>
              Fermer
            </button>

            <button onClick={validerPopup}>
              Enregistrer
            </button>

          </div>
        </div>
      )}

    </>
  )
}

export default App
