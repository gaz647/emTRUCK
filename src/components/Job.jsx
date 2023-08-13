/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteJobFromDatabase } from "../redux/JobsSlice";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { FcExpand } from "react-icons/fc";
import { PiNumberSquareTwoBold } from "react-icons/pi";
import "./Job.css";
import { useState } from "react";

const Job = ({ jobDetails }) => {
  const {
    city,
    cmr,
    date,
    day,
    id,
    isSecondJob,
    note,
    price,
    terminal,
    waiting,
    weight,
    zipcode,
  } = jobDetails;

  const dispatch = useDispatch();

  const userUid = useSelector((state) => state.auth.loggedInUserUid);

  const deleteJob = () => {
    const jobId = id;
    const payload = { userUid, jobId };
    if (confirm("Smazat práci?")) {
      dispatch(deleteJobFromDatabase(payload));
    }
  };

  const displayCZdateFormat = (date) => {
    return date.split("-").reverse().join(".");
  };

  const [showDetails, setShowDetails] = useState(false);

  const handleShow = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="one-job">
      <div className="one-job-header">
        <BsPencil />
        <div>{day}</div>
        <div>{displayCZdateFormat(date)}</div>
        <div>{price + " €"}</div>
        <BsTrash3 onClick={deleteJob} />
      </div>
      <div className="one-job-details">
        <div className="one-job-body-preview">
          <div className="one-job-body-preview-item-city">{city}</div>
          <div className="one-job-body-preview-item-zipcode">{zipcode}</div>
          <FcExpand
            className={`expand-btn ${showDetails ? "opened" : ""}`}
            onClick={handleShow}
          />
        </div>
        {showDetails && (
          <div className="one-job-body-content">
            <div className="one-job-body-content-item-cmr">{cmr}</div>
            <div className="one-job-body-content-item-terminal">
              {"terminál: " + terminal}
            </div>
            <div className="one-job-body-content-item note">
              {note !== "" ? <div>&#40;{note}&#41;</div> : ""}
            </div>
          </div>
        )}
      </div>
      <div className="one-job-footer">
        <div>
          {isSecondJob ? (
            <PiNumberSquareTwoBold className="one-job-footer-second-job-icon" />
          ) : (
            ""
          )}
        </div>
        <div className="one-job-footer-weight">{weight + "t"}</div>
        <div>
          {waiting > 0 ? (
            <div className="one-job-footer-waiting-icon">{waiting}</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;
