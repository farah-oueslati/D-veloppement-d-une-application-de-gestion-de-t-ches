import React, { useState } from "react";
import "./style.css";
import "./dark-login.css";
import KanbanView from "./components/KanbanView";

export default function App() {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.name.value;
    const firstname = form.elements.firstname.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    console.log("Signup:", { name, firstname, email, password });
    alert(`Bienvenue ${firstname} ${name} ! Inscription réussie.`);
    form.reset();
    setIsLoggedIn(true);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    console.log("Login:", { email, password });
    alert("Connexion réussie!");
    form.reset();
    setIsLoggedIn(true);
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
            <input type="email" placeholder="Email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
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
            <input type="email" placeholder="Email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"/>
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