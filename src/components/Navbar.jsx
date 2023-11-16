import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { BiSpreadsheet } from "react-icons/bi";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiCharacterRecognitionLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setIsEditingFalseRedux,
  resetJobToAddValuesRedux,
  resetJobToEditValuesRedux,
  resetArchiveMonthSummarySettingsToEditRedux,
} from "../redux/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const isLoading = useSelector((state) => state.auth.isLoading);
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isEditing = useSelector((state) => state.auth.isEditing);

  // USE STATE -----------------------------------------------------------
  //

  // RESET ---------------------------------------------------------------
  //
  const reset = () => {
    dispatch(setIsEditingFalseRedux());
    dispatch(resetJobToAddValuesRedux());
    dispatch(resetJobToEditValuesRedux());
    dispatch(resetArchiveMonthSummarySettingsToEditRedux());
  };

  // USE EFFECT ----------------------------------------------------------
  //

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {isLoading ||
          (isLoading2 && <div className="navbar-click-blocker"></div>)}
        <NavLink
          to={"/"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <BiSpreadsheet />
        </NavLink>

        <NavLink
          to={"/search"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <PiMagnifyingGlassBold />
        </NavLink>

        {isEditing ? (
          <NavLink
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            <BsPencil />
          </NavLink>
        ) : (
          <NavLink
            to={"/add-job"}
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            <AiOutlinePlusCircle />
          </NavLink>
        )}

        <NavLink
          to={"/archive"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <RiCharacterRecognitionLine />
        </NavLink>

        <NavLink
          to={"/settings"}
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
          onClick={reset}
        >
          <FiSettings />
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
