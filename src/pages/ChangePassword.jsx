import "./ChangePassword.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../redux/AuthSlice";

const ChangeEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword1] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("click");
    // password password
    if (
      currentPassword &&
      newPassword1 &&
      newPassword1.length > 5 &&
      newPassword2 &&
      newPassword2.length > 5 &&
      newPassword1 === newPassword2
    ) {
      console.log(
        "ChangePassword.jsx - Uživatel vyplnil nové heslo - bude spuštěn dispatch pro změnu hesla"
      );
      dispatch(changePassword({ currentPassword, newPassword: newPassword1 }));
    } else {
      console.log(
        "ChangePassword - Uživatelem zadané údaje se buď neshodují nebo je heslo < 5"
      );
    }
  };

  const handleDecline = () => {
    navigate("/settings");
  };

  return (
    <section className="wrapper">
      <header className="change-email-password-header">
        <div className="change-email-password-header-title">změna hesla</div>
      </header>
      <main>
        <form className="change-email-password-form" onSubmit={handleSubmit}>
          <div className="change-email-password-form-container">
            <label className="change-email-password-form-item-container-label">
              současné heslo
            </label>
            <div className="change-email-password-form-item-container-password">
              <input
                className="change-email-password-form-item-container-input"
                type="text"
                placeholder="nové heslo"
                value={currentPassword}
                onChange={(e) => setCurrentPassword1(e.target.value)}
              />

              <div className="warning-container">
                {((newPassword1.length > 0 &&
                  newPassword1.length < 6 &&
                  !newPassword2) ||
                  (newPassword2.length > 0 &&
                    newPassword2.length < 6 &&
                    !newPassword1)) && (
                  <div className="warning-message">minimálně 6 znaků</div>
                )}
                {newPassword1.length > 5 &&
                  newPassword2.length > 5 &&
                  newPassword1 !== newPassword2 && (
                    <div className="warning-message">hesla se neshodují</div>
                  )}
              </div>
            </div>
          </div>
          <div className="change-email-password-form-container">
            <label className="change-email-password-form-item-container-label">
              nové heslo
            </label>
            <div className="change-email-password-form-item-container-password">
              <input
                className="change-email-password-form-item-container-input"
                type="text"
                placeholder="nové heslo"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
              />
              <input
                className="change-email-password-form-item-container-input"
                type="text"
                placeholder="nové heslo znovu"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                disabled={newPassword1.length < 6}
              />
              <div className="warning-container">
                {((newPassword1.length > 0 &&
                  newPassword1.length < 6 &&
                  !newPassword2) ||
                  (newPassword2.length > 0 &&
                    newPassword2.length < 6 &&
                    !newPassword1)) && (
                  <div className="warning-message">minimálně 6 znaků</div>
                )}
                {newPassword1.length > 5 &&
                  newPassword2.length > 5 &&
                  newPassword1 !== newPassword2 && (
                    <div className="warning-message">hesla se neshodují</div>
                  )}
              </div>
            </div>
          </div>

          <div className="confirm-decline-buttons-container">
            <button className="confirm-btn" type="submit">
              změnit
            </button>
            <button
              className="decline-btn"
              type="button"
              onClick={handleDecline}
            >
              zrušit
            </button>
          </div>
        </form>
      </main>
    </section>
  );
};

export default ChangeEmail;
