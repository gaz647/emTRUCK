import "./Login.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerRedux, runToastRedux } from "../redux/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { ToastContainer, toast, Flip } from "react-toastify";
import { resetToastRedux } from "../redux/AuthSlice";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPasword] = useState("");
  const [registerPassword2, setRegisterPasword2] = useState("");

  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isLoading);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerPassword !== registerPassword2) {
      dispatch(
        runToastRedux({
          message: "Hesla se neshodují!",
          style: "error",
          time: 3000,
        })
      );
      return;
    } else {
      let registerCredentials = { registerEmail, registerPassword };
      dispatch(registerRedux(registerCredentials));
    }
  };

  const isRegisterSuccess = useSelector(
    (state) => state.auth.isRegisterSuccess
  );

  useEffect(() => {
    if (isRegisterSuccess) {
      navigate("/change-verification", {
        replace: true,
        state: {
          firstMessage:
            "Email s odkazem pro potvrzení registrace byl úspěšně odeslán!",
          secondMessage: "Zkontrolujte Vaši emailovou schránku.",
        },
      });
    }
  }, [isRegisterSuccess, navigate]);

  const toastRedux = useSelector((state) => state.auth.toast);

  useEffect(() => {
    if (toastRedux.isVisible) {
      console.log("toast SPUŠTĚN");
      toastRedux.style === "success"
        ? toast.success(`${toastRedux.message}`)
        : toastRedux.style === "error"
        ? toast.error(`${toastRedux.message}`)
        : null;
    }
  }, [toastRedux]);

  const resetToastStateRedux = useSelector(
    (state) => state.auth.toast.resetToast
  );

  useEffect(() => {
    if (resetToastStateRedux) {
      setTimeout(() => {
        dispatch(resetToastRedux());
      }, 500);
    }
  }, [resetToastStateRedux, dispatch]);

  const handleDecline = () => {
    navigate("/");
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <section className="login-register">
          <ToastContainer
            transition={Flip}
            position="top-center"
            autoClose={toastRedux.time}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <form className="login-register-form">
            <h1 className="login-register-form-heading">Registrace</h1>
            <div className="login-register-form-item">
              <input
                className="login-register-form-input"
                type="email"
                placeholder="email"
                onChange={(e) => setRegisterEmail(e.target.value)}
                value={registerEmail}
              />
            </div>

            <input
              className="login-register-form-input"
              type="password"
              placeholder="zadejte heslo"
              onChange={(e) => setRegisterPasword(e.target.value)}
              value={registerPassword}
            />
            <input
              className="login-register-form-input"
              type="password"
              placeholder="zadejte stejné heslo"
              onChange={(e) => setRegisterPasword2(e.target.value)}
              value={registerPassword2}
            />

            <ConfirmDeclineBtns
              confirmFunction={handleRegister}
              declineFunction={handleDecline}
            />

            <p>
              Již máte účet? <Link to={"/login"}>Přihlašte se.</Link>{" "}
            </p>
          </form>
        </section>
      )}
    </>
  );
};

export default Register;
