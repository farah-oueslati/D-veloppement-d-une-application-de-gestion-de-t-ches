import React, { useState } from "react";
import "./style.css";
import "./dark-login.css";
import KanbanView from "./components/KanbanView";
import axios from "axios";

export default function App() {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/users";

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value;
    const firstname = form.elements.firstname.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      const res = await axios.post(`${API_URL}`, {
        name,
        firstname,
        email,
        password,
      },
    {withCredentials: true,});

      console.log("Inscription réussie:", res.data);
      alert(`Bienvenue ${firstname} ${name} !`);
      form.reset();
      setIsLoggedIn(true);
    } catch (error) {
      console.log(name,firstname,email,password);
     // console.error("Erreur lors de l'inscription:", error);
      alert("Erreur lors de l'inscription.");
    }
  };
  const handleSignInSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.elements.email.value;
  const password = form.elements.password.value;

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login", {
      email,
      password,
    }, {
      withCredentials: true,
    });

    console.log("Connexion réussie:", res.data);
    alert("Connexion réussie !");
    form.reset();
    setIsLoggedIn(true);
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    alert("Email ou mot de passe incorrect.");
  }
};


  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <KanbanView onLogout={handleLogout} />;
  }

  return (
    <>
      <div className={`container${rightPanelActive ? " right-panel-active" : ""}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Créer un compte</h1>
            <br />
            <br />
            <input type="text" placeholder="Nom" name="name" required />
            <input type="text" placeholder="Prénom" name="firstname" required />
            <input type="email" placeholder="Email" name="email" required/>
            <input type="password" placeholder="Mot de passe" name="password" required minLength={8}/>
            <br />
            <button type="submit">S'INSCRIRE</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Se connecter</h1>
            <br />
            <br />
            <input type="email" placeholder="Email" name="email" required/>
            <input type="password" placeholder="Mot de passe" name="password" required minLength={8} />
            <a href="#">Mot de passe oublié?</a>
            <button type="submit">CONNECTER</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <button className="ghost" id="signUp" onClick={handleSignInClick}>
                SE CONNECTER
              </button>
            </div>
            
            <div className="overlay-panel overlay-right">
              <div className="logo-container">
                <img className="logoimg" src="logo.jpg" alt="Logo" />
                <h1>
                  <span className="black">Opti</span>
                  <span className="white">tâche</span>
                </h1>
              </div>
              <button className="ghost" id="signIn" onClick={handleSignUpClick}>
                S'INSCRIRE
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2025 Multitâche. Tous droits réservés.</p>
      </footer>
    </>
  );
}
