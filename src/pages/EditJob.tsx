import "./EditJob.css";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import { useSelector, useDispatch } from "react-redux";
import {
  editJobRedux,
  editArchiveJobRedux,
  editArchiveDoneJobsNewMonthRedux,
  setIsEditingFalseRedux,
  setIsEditingArchivedJobFalseRedux,
  resetJobToEditValuesRedux,
  runToastRedux,
} from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import sortJobs from "../customFunctionsAndHooks/sortJobs";
import sortArchiveMonthJobsAscending from "../customFunctionsAndHooks/sortArchiveMonthJobsAscending";
import sortArchiveMonthsDescending from "../customFunctionsAndHooks/sortArchiveMonthsDescending";
import trimArchiveOver13months from "../customFunctionsAndHooks/trimArchiveOver13month";
import compareMonths from "../customFunctionsAndHooks/compareMonths";
import ConfirmDeclineBtns from "../components/ConfirmDeclineBtns";
import InputField from "../components/InputField";
import Spinner from "../components/Spinner";

type JobType = {
  city: string;
  cmr: string;
  date: string;
  day: string;
  id: string;
  isCustomJob: boolean;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  terminal: string;
  timestamp: number;
  waiting: number;
  weight: number;
  weightTo27t: number;
  weightTo34t: number;
  zipcode: string;
};

const EditJob = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const currentJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );
  const isCustomJob = useAppSelector(
    (state) => state.auth.jobToEdit.isCustomJob
  );
  const isHoliday = useAppSelector((state) => state.auth.jobToEdit.isHoliday);
  const timestamp = useAppSelector((state) => state.auth.jobToEdit.timestamp);
  const weightTo27t = useAppSelector(
    (state) => state.auth.jobToEdit.weightTo27t
  );
  const weightTo34t = useAppSelector(
    (state) => state.auth.jobToEdit.weightTo34t
  );
  const [price, setPrice] = useState(
    useAppSelector((state) => state.auth.jobToEdit.price)
  );
  const [isSecondJob, setIsSecondJob] = useState(
    useAppSelector((state) => state.auth.jobToEdit.isSecondJob)
  );
  const [waiting, setWaiting] = useState(
    useAppSelector((state) => state.auth.jobToEdit.waiting)
  );
  const [note, setNote] = useState(
    useAppSelector((state) => state.auth.jobToEdit.note)
  );
  const [terminal, setTerminal] = useState(
    useAppSelector((state) => state.auth.jobToEdit.terminal)
  );
  const id = useAppSelector((state) => state.auth.jobToEdit.id);
  const userUid = useAppSelector((state) => state.auth.loggedInUserUid);
  const archivedJobs = useAppSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const isEditingArchivedJob = useAppSelector(
    (state) => state.auth.isEditingArchivedJob
  );
  const isLoading2 = useAppSelector((state) => state.auth.isLoading2);
  const isEditJobReduxSuccess = useAppSelector(
    (state) => state.auth.isEditJobReduxSuccess
  );
  const isEditArchiveJobReduxSuccess = useAppSelector(
    (state) => state.auth.isEditArchiveJobReduxSuccess
  );
  const dateSel = useAppSelector((state) => state.auth.jobToEdit.date);

  const userSettings = useAppSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );

  // USE STATE -----------------------------------------------------------
  //
  const [date, setDate] = useState(
    useAppSelector((state) => state.auth.jobToEdit.date)
  );
  const [day, setDay] = useState("");
  const [city, setCity] = useState(
    useAppSelector((state) => state.auth.jobToEdit.city)
  );
  const [cmr, setCmr] = useState(
    useAppSelector((state) => state.auth.jobToEdit.cmr)
  );
  const [zipcode, setZipcode] = useState(
    useAppSelector((state) => state.auth.jobToEdit.zipcode)
  );
  const [weight, setWeight] = useState(
    useAppSelector((state) => state.auth.jobToEdit.weight)
  );

  // GET CURRENT DAY CZ --------------------------------------------------
  //
  const getCurrentDayCZ = (dateVariable: string) => {
    const dateTransformed = new Date(dateVariable);
    const daysOfTheWeek = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"];
    return daysOfTheWeek[dateTransformed.getDay()];
  };

  // HANDLE WEIGHT CHANGE ------------------------------------------------
  //
  const handleWeightChange = (newWeight: number) => {
    if (newWeight === 27) {
      setWeight(27);
      if (!isCustomJob) {
        setPrice(weightTo27t);
        // console.log("weight:", weight, "price:", price);
      }
    } else if (newWeight === 34) {
      setWeight(34);
      if (!isCustomJob) {
        setPrice(weightTo34t);
        // console.log("weight:", weight, "price:", price);
      }
    }
  };

  // EDIT JOB ------------------------------------------------------------
  //
  const editJob = (e: React.FormEvent) => {
    e.preventDefault();
    let editedJob: JobType = {
      city: "",
      cmr: "",
      date: "",
      day: "",
      id: "",
      isCustomJob: false,
      isHoliday: false,
      isSecondJob: false,
      note: "",
      price: 0,
      terminal: "",
      timestamp: 0,
      waiting: 0,
      weight: 0,
      weightTo27t: 0,
      weightTo34t: 0,
      zipcode: "",
    };

    if (!isHoliday) {
      if (!city || !cmr || !zipcode || !terminal) {
        dispatch(
          runToastRedux({
            message: "Vyplňte povinná pole.",
            style: "error",
            time: 3000,
          })
        );
        return;
      }

      editedJob = {
        city,
        cmr,
        date,
        day,
        id,
        isCustomJob,
        isHoliday,
        isSecondJob,
        note,
        price: Number(price),
        terminal,
        timestamp: Number(timestamp),
        waiting: Number(waiting),
        weight: Number(weight),
        weightTo27t: Number(weightTo27t),
        weightTo34t: Number(weightTo34t),
        zipcode,
      };
    } else if (isHoliday) {
      editedJob = {
        city: "DOVOLENÁ",
        cmr: "",
        date,
        day,
        id,
        isCustomJob,
        isHoliday,
        isSecondJob: false,
        note,
        price: 0,
        terminal: "",
        timestamp: new Date().getTime(),
        waiting: 0,
        weight: 0,
        weightTo27t: 0,
        weightTo34t: 0,
        zipcode: "",
      };
    }
    // EDIT CURRENT JOB
    if (!isEditingArchivedJob) {
      console.log("editována práce z currentJobs");

      const tempCurrentJobs = [...currentJobs];

      const indexOfJobToBeEdited = tempCurrentJobs.findIndex(
        (job: JobType) => job.id === editedJob.id
      );

      if (indexOfJobToBeEdited !== -1) {
        tempCurrentJobs[indexOfJobToBeEdited] = editedJob;

        const sortedCurrentJobsEdit = sortJobs(tempCurrentJobs);

        if (userUid) {
          const payload = { userUid, sortedCurrentJobsEdit };

          dispatch(editJobRedux(payload));
        }
      }
    }
    // EDIT ARCHIVED JOB
    else if (isEditingArchivedJob) {
      console.log("bude upravena práce z archivu");

      const tempArchivedJobs = [...archivedJobs];

      let updatedArchivedJobs = [];

      let sortedUpdatedArchivedJobs;

      let payload;

      // upravovaná práce má STEJNÝ MĚSÍC
      if (compareMonths(dateSel, date)) {
        console.log("STEJNÝ MĚSÍC");
        updatedArchivedJobs = tempArchivedJobs.map((oneMonth) => {
          if (oneMonth.jobs.some((job: JobType) => job.id === id)) {
            const updatedJobs = oneMonth.jobs.map((job: JobType) =>
              job.id === id ? editedJob : job
            );
            return {
              ...oneMonth,
              jobs: updatedJobs,
            };
          }
          return oneMonth;
        });

        sortedUpdatedArchivedJobs =
          sortArchiveMonthJobsAscending(updatedArchivedJobs);

        if (userUid) {
          payload = {
            userUid,
            sortedUpdatedArchivedJobs,
          };

          dispatch(editArchiveJobRedux(payload));
        }
      }
      // upravovaná práce JINÝ MĚSÍC
      else {
        let indexOfMonthToMoveJob = 0;

        for (let i = 0; i < archivedJobs.length; i++) {
          if (compareMonths(archivedJobs[i].date, date)) {
            indexOfMonthToMoveJob = i;
          }
        }

        // měsíc pro přesunutí EXISTUJE - přesunout práci
        if (indexOfMonthToMoveJob !== undefined) {
          updatedArchivedJobs = archivedJobs.map((archivedMonth, index) => {
            if (index === indexOfMonthToMoveJob) {
              console.log("ano");
              return {
                ...archivedMonth,
                jobs: [...archivedMonth.jobs, editedJob],
              };
            } else {
              console.log(typeof archivedMonth.jobs);
              return {
                ...archivedMonth,
                jobs: archivedMonth.jobs.filter(
                  (oneJob: JobType) => oneJob.id !== id
                ),
              };
            }
          });
          console.log(updatedArchivedJobs);

          sortedUpdatedArchivedJobs =
            sortArchiveMonthJobsAscending(updatedArchivedJobs);

          console.log("hotovo");
          console.log(sortedUpdatedArchivedJobs);

          if (userUid) {
            payload = {
              userUid,
              sortedUpdatedArchivedJobs,
            };

            dispatch(editArchiveJobRedux(payload));
          }
        }
        // měsíc NEEXISTUJE - vytvořit nový
        else {
          console.log("je potřeba vytvořit nový měsíc");

          const dateForArchiving = editedJob.date.slice(0, -2) + "01";

          const monthToArchive = {
            date: dateForArchiving,
            jobs: [editedJob],
            userSettings,
          };

          const filteredArchivedJobs = archivedJobs.map((oneMonth) => {
            return {
              ...oneMonth,
              jobs: oneMonth.jobs.filter((job: JobType) => job.id !== id),
            };
          });

          const newMonthToArchive = trimArchiveOver13months(
            sortArchiveMonthJobsAscending(
              sortArchiveMonthsDescending([
                ...filteredArchivedJobs,
                monthToArchive,
              ])
            )
          );

          console.log(newMonthToArchive);

          if (userUid) {
            const payload = {
              userUid,
              newMonthToArchive,
            };

            dispatch(editArchiveDoneJobsNewMonthRedux(payload));
          }
        }
      }
    }
  };

  // HANDLE DECLINE ------------------------------------------------------
  //
  const handleDecline = () => {
    dispatch(resetJobToEditValuesRedux());
    dispatch(setIsEditingFalseRedux());
    if (isEditingArchivedJob) {
      navigate("/archive");
    } else if (!isEditingArchivedJob) {
      navigate("/");
    }
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    setDay(getCurrentDayCZ(date));
  }, [date]);

  useEffect(() => {
    if (isEditJobReduxSuccess) {
      dispatch(resetJobToEditValuesRedux());
      dispatch(setIsEditingFalseRedux());
      navigate("/");
    } else if (isEditArchiveJobReduxSuccess) {
      dispatch(resetJobToEditValuesRedux());
      dispatch(setIsEditingFalseRedux());
      dispatch(setIsEditingArchivedJobFalseRedux());
      navigate("/archive");
    }
  }, [dispatch, isEditArchiveJobReduxSuccess, isEditJobReduxSuccess, navigate]);

  return (
    <section className="add-job wrapper">
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <form className="add-job-form">
            {!isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />

                <InputField
                  required={true}
                  label={"Město"}
                  type={"text"}
                  value={city}
                  onTextChange={(e) => setCity(e)}
                />

                <InputField
                  required={true}
                  label={"PSČ"}
                  type={"text"}
                  value={zipcode}
                  onTextChange={(e) => setZipcode(e)}
                />

                <InputField
                  label={""}
                  type={"weight"}
                  value={weight}
                  onWeightChange={(e) => handleWeightChange(e)}
                />

                <InputField
                  label={"Cena"}
                  type={"number"}
                  value={price}
                  onNumberChange={(e) => setPrice(e)}
                />

                <InputField
                  required={true}
                  label={"CMR"}
                  type={"text"}
                  value={cmr}
                  onTextChange={(e) => setCmr(e)}
                />

                <InputField
                  label={"Druhá práce"}
                  type={"checkbox"}
                  value={isSecondJob}
                  onCheckboxChange={(e) => setIsSecondJob(e)}
                />

                <InputField
                  label={"Čekání"}
                  type={"number"}
                  value={waiting}
                  onNumberChange={(e) => setWaiting(e)}
                />

                <InputField
                  label={"Poznámka"}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />

                <InputField
                  required={true}
                  label={"Terminál"}
                  type={"text"}
                  value={terminal}
                  onTextChange={(e) => setTerminal(e)}
                />
              </>
            )}
            {isHoliday && (
              <>
                <InputField
                  label={"Datum"}
                  type={"date"}
                  value={date}
                  onDateChange={(e) => setDate(e)}
                />
                <InputField
                  label={"Poznámka"}
                  type={"text"}
                  value={note}
                  onTextChange={(e) => setNote(e)}
                />
              </>
            )}

            <ConfirmDeclineBtns
              disabled={!isHoliday && (!city || !zipcode || !cmr || !terminal)}
              confirmFunction={editJob}
              declineFunction={handleDecline}
            />
          </form>
        </>
      )}
    </section>
  );
};

export default EditJob;
