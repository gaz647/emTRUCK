import "./ConfirmDeclineBtns.css";
import { MouseEventHandler } from "react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { MdDoNotDisturbAlt } from "react-icons/md";

const ConfirmDeclineBtns = ({
  confirmFunction,
  declineFunction,
  disabled,
  register,
}: {
  confirmFunction: MouseEventHandler<HTMLButtonElement>;
  declineFunction: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  register?: boolean;
}) => {
  return (
    <div className="confirm-decline-btns-container">
      <button
        className={`confirm-decline-btns confirm-btn ${
          disabled && "confirm-btn-disabled"
        } ${register && "confirm-btn-register"}`}
        onClick={confirmFunction}
        disabled={disabled}
      >
        {register && !disabled ? (
          <div className="register-btn-text">REGISTROVAT</div>
        ) : disabled ? (
          <MdDoNotDisturbAlt className="confirm-decline-btn-icon" />
        ) : (
          <ImCheckmark className="confirm-decline-btn-icon" />
        )}
      </button>
      {!register && (
        <button
          className="confirm-decline-btns decline-btn"
          onClick={declineFunction}
        >
          <ImCross className="confirm-decline-btn-icon" />
        </button>
      )}
    </div>
  );
};

export default ConfirmDeclineBtns;
