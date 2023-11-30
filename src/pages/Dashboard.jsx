import "./Dashboard.css";
import ModalPrompt from "../components/ModalPrompt";
import Job from "../components/Job";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  archiveDoneJobsFirstTimeRedux,
  archiveDoneJobsNewMonthRedux,
  archiveDoneJobsExistingMonthRedux,
  changeSettingsRedux,
  resetIsAddJobReduxSuccess,
  resetIsEditJobReduxSuccess,
  setIsLoading2FalseRedux,
  resetIsChangeSettingsReduxSuccess,
} from "../redux/AuthSlice";
import { PiNumberSquareTwoBold, PiClockBold } from "react-icons/pi";
import { TbRoad } from "react-icons/tb";
import { FaUmbrellaBeach } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import getDateForComparing from "../customFunctionsAndHooks/getDateForComparing";
import sortArchiveMonthsDescending from "../customFunctionsAndHooks/sortArchiveMonthsDescending";
import sortArchiveMonthJobsAscending from "../customFunctionsAndHooks/sortArchiveMonthJobsAscending";
import sortCurrentJobsToBeArchivedAscending from "../customFunctionsAndHooks/sortCurrentJobsToBeArchivedAscending";
import trimArchiveOver13months from "../customFunctionsAndHooks/trimArchiveOver13month";
import getEurCzkCurrencyRate from "../customFunctionsAndHooks/getEurCzkCurrencyRate";
import Spinner from "../components/Spinner";
import BackToTopBtn from "../components/BackToTopBtn";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //
  const loggedInUserSettings = useSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );
  const loggedInUserEmail = useSelector(
    (state) => state.auth.loggedInUserEmail
  );
  const currentJobs = useSelector(
    (state) => state.auth.loggedInUserData.currentJobs
  );
  const archivedJobs = useSelector(
    (state) => state.auth.loggedInUserData.archivedJobs
  );
  const userUid = useSelector((state) => state.auth.loggedInUserUid);
  const userSettings = useSelector(
    (state) => state.auth.loggedInUserData.userSettings
  );
  const baseMoney = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.baseMoney
  );
  const eurCzkRate = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.eurCzkRate
  );
  const percentage = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.percentage
  );
  const secondJobBenefit = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.secondJobBenefit
  );
  const waitingBenefitEmployerCzk = useSelector(
    (state) =>
      state.auth.loggedInUserData.userSettings.waitingBenefitEmployerCzk
  );
  const waitingBenefitEur = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.waitingBenefitEur
  );
  const email = useSelector(
    (state) => state.auth.loggedInUserData.userSettings.email
  );
  const isLoading2 = useSelector((state) => state.auth.isLoading2);
  const isAddJobReduxSuccess = useSelector(
    (state) => state.auth.isAddJobReduxSuccess
  );
  const isEditJobReduxSuccess = useSelector(
    (state) => state.auth.isEditJobReduxSuccess
  );
  const isArchiveDoneJobsAllCasesReduxSuccess = useSelector(
    (state) => state.auth.isArchiveDoneJobsAllCasesReduxSuccess
  );
  const isChangeSettingsReduxSuccess = useSelector(
    (state) => state.auth.isChangeSettingsReduxSuccess
  );

  // USE STATE -----------------------------------------------------------
  //
  const [totalEur, setTotalEur] = useState(0);
  const [totalCzk, setTotalCzk] = useState(0);
  const [salary, setSalary] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalHolidays, setTotalHolidays] = useState(0);
  const [totalSecondJobs, setTotalSecondJobs] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // ARCHIVE JOBS 2 ------------------------------------------------------
  // nejdříve získá kurz EUR/CZK a až potom zavolá funkci archiveJobs ----
  //
  const archiveJobs2 = async () => {
    try {
      const renewedEurCzkRate = await getEurCzkCurrencyRate(); // Počká na dokončení asynchronní funkce
      archiveJobs(renewedEurCzkRate);
    } catch (error) {
      console.error(error.message);
    }
  };

  // ARCHIVE JOBS --------------------------------------------------------
  //
  const archiveJobs = (newEurCzkRate) => {
    setShowArchiveModal(!showArchiveModal);

    const currentArchivedJobs =
      archivedJobs.length > 0 ? [...archivedJobs] : [];

    const dateForArchiving =
      currentJobs[currentJobs.length - 1].date.slice(0, -2) + "01";

    const jobsToBeArchived = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) ===
        getDateForComparing(dateForArchiving)
    );

    const sortedJobsToBeArchived =
      sortCurrentJobsToBeArchivedAscending(jobsToBeArchived);

    const filteredCurrentJobs = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) !==
        getDateForComparing(dateForArchiving)
    );

    const monthToArchive = {
      date: dateForArchiving,
      jobs: sortedJobsToBeArchived,
      userSettings: {
        baseMoney,
        eurCzkRate,
        percentage,
        secondJobBenefit,
        waitingBenefitEmployerCzk,
        waitingBenefitEur,

        // baseMoney: 0,
        // email: "",
        // eurCzkRate: 0,
        // nameFirst: "",
        // nameSecond: "",
        // numberEm: "",
        // numberTrailer: "",
        // numberTruck: "",
        // percentage: 0,
        // secondJobBenefit: 0,
        // terminal: "",
        // waitingBenefitEmployerCzk: 0,
        // waitingBenefitEur: 0,
      },
    };

    // Pokud je archiv prázdný
    // ARCHIVE DONE JOBS FIRST TIME
    // (poslat nový kurz)
    //
    if (currentArchivedJobs.length === 0) {
      console.log("archiv je prázdný");
      console.log("první ukládání do archivu");
      const payload = {
        userUid,
        monthToArchive: [{ ...monthToArchive }],
        filteredCurrentJobs,
        userSettings,
        newEurCzkRate,
      };
      console.log(payload);
      dispatch(archiveDoneJobsFirstTimeRedux(payload));
    }
    // Pokud archív NENÍ prázdný
    //
    else {
      console.log("archiv není prázdný");

      const indexOfMonthToPutJobs = currentArchivedJobs.findIndex(
        (oneMonth) =>
          getDateForComparing(oneMonth.date) ===
          getDateForComparing(dateForArchiving)
      );
      //
      //
      // Když měsíc v archivu neexistuje
      // ARCHIVE DONE JOBS NEW MONTH
      // (poslat nový kurz)
      //
      //
      //
      if (indexOfMonthToPutJobs === -1) {
        console.log("měsíc v archivu neexistuje");
        console.log("kód pro přidání nového měsíce do archivu");

        const newMonthToArchive = trimArchiveOver13months(
          sortArchiveMonthJobsAscending(
            sortArchiveMonthsDescending([...archivedJobs, monthToArchive])
          )
        );

        const payload = {
          userUid,
          newMonthToArchive,
          filteredCurrentJobs,
          userSettings,
          newEurCzkRate,
        };

        dispatch(archiveDoneJobsNewMonthRedux(payload));
      }
      //
      //
      // Když měsíc v archivu existuje
      // ARCHIVE DONE JOBS FIRST TIME
      //
      //
      else {
        console.log("měsíc v archivu existuje");
        console.log("index měsíce v archivu je: ", indexOfMonthToPutJobs);
        console.log("kód pro přidání prací do existujícího měsíce v archivu");

        const updatedArchivedJobs = sortArchiveMonthJobsAscending(
          currentArchivedJobs.map((archivedMonth, index) => {
            if (index === indexOfMonthToPutJobs) {
              return {
                ...archivedMonth,
                jobs: [...archivedMonth.jobs, ...jobsToBeArchived],
              };
            }
            return archivedMonth;
          })
        );

        const payload = {
          userUid,
          updatedArchivedJobs,
          filteredCurrentJobs,
          userSettings,
        };

        dispatch(archiveDoneJobsExistingMonthRedux(payload));
      }
    }
  };

  // HANDLE MODAL VISIBILITY ---------------------------------------------
  //
  const handleArchiveModalVisibility = () => {
    setShowArchiveModal(!showArchiveModal);
  };

  //
  //
  //
  const showJobsToBeArchived = () => {
    console.log("SPUŠTĚNO");
    const dateForArchiving =
      currentJobs[currentJobs.length - 1].date.slice(0, -2) + "01";

    const jobsToBeArchived = currentJobs.filter(
      (oneJob) =>
        getDateForComparing(oneJob.date) ===
        getDateForComparing(dateForArchiving)
    );

    console.log(sortCurrentJobsToBeArchivedAscending(jobsToBeArchived));
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    setTotalJobs(
      currentJobs.filter((oneJob) => {
        return !oneJob.isHoliday;
      }).length
    );
    setTotalHolidays(
      currentJobs.filter((oneJob) => {
        return oneJob.isHoliday;
      }).length
    );
    setTotalSecondJobs(
      currentJobs.filter((oneJob) => oneJob.isSecondJob === true).length
    );
    setTotalWaiting(
      currentJobs.reduce((acc, oneJob) => {
        return acc + Number(oneJob.waiting);
      }, 0)
    );
    setTotalEur(
      // sečte eura z prací + eura za čekání
      // proto se při výpočtu salary už přičítá pouze příplatek od zaměstnavatele
      currentJobs.reduce((acc, oneJob) => {
        return (
          acc +
          Number(oneJob.price) +
          Number(oneJob.waiting * waitingBenefitEur)
        );
      }, 0)
    );
    setTotalCzk(parseInt(totalEur * eurCzkRate));

    setSalary(
      parseInt(
        baseMoney +
          totalCzk * (percentage * 0.01) +
          totalSecondJobs * secondJobBenefit +
          // waitingBenefitEur se nepřičítá - je už totalEur
          totalWaiting * waitingBenefitEmployerCzk
      )
    );
  }, [
    currentJobs,
    eurCzkRate,
    totalEur,
    baseMoney,
    totalCzk,
    percentage,
    totalSecondJobs,
    secondJobBenefit,
    totalWaiting,
    waitingBenefitEmployerCzk,
    waitingBenefitEur,
  ]);

  useEffect(() => {
    if (email && loggedInUserEmail) {
      if (email !== loggedInUserEmail) {
        console.log(
          "email byl změněn --> spouštím dispatch pro změnu userSettings"
        );
        console.log(email);
        console.log(loggedInUserEmail);

        const payload = {
          userUid,
          userSettings: {
            baseMoney: Number(loggedInUserSettings.baseMoney),
            email: loggedInUserEmail,
            eurCzkRate: Number(loggedInUserSettings.eurCzkRate),
            percentage: Number(loggedInUserSettings.percentage),
            secondJobBenefit: Number(loggedInUserSettings.secondJobBenefit),
            terminal: loggedInUserSettings.terminal,
            waitingBenefitEmployerCzk: Number(
              loggedInUserSettings.waitingBenefitEmployerCzk
            ),
            waitingBenefitEur: Number(loggedInUserSettings.waitingBenefitEur),
          },
        };
        console.log(payload);
        dispatch(changeSettingsRedux(payload));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, email, loggedInUserEmail]);

  useEffect(() => {
    if (isAddJobReduxSuccess) {
      dispatch(resetIsAddJobReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isEditJobReduxSuccess) {
      dispatch(resetIsEditJobReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    } else if (isArchiveDoneJobsAllCasesReduxSuccess) {
      navigate("/archive");
    } else if (isChangeSettingsReduxSuccess) {
      dispatch(resetIsChangeSettingsReduxSuccess());
      dispatch(setIsLoading2FalseRedux());
    }
  }, [
    isAddJobReduxSuccess,
    isEditJobReduxSuccess,
    isArchiveDoneJobsAllCasesReduxSuccess,
    isChangeSettingsReduxSuccess,
    dispatch,
    navigate,
  ]);

  return (
    <section className="wrapper relative">
      <BackToTopBtn />
      {isLoading2 ? (
        <div className="full-page-container-center">
          <Spinner />
        </div>
      ) : (
        <>
          <section className="dashboard">
            {showArchiveModal && (
              <ModalPrompt
                heading={
                  "Archivovat práce z posledního měsíce ve Vašem výpisu?"
                }
                text={"tento krok nelze vrátit zpět"}
                confirmFunction={archiveJobs2}
                declineFunction={handleArchiveModalVisibility}
              />
            )}
            <div className="dashboard-summary-invoicing">
              <div className="dashboard-summary-invoicing-container">
                <div className="dashboard-summary-invoicing-heading">
                  <LiaFileInvoiceDollarSolid />
                </div>

                <div className="dashboard-summary-invoicing-count">
                  {totalEur.toLocaleString() + " € "}
                </div>
                <div className="dashboard-summary-invoicing-count">
                  {totalCzk.toLocaleString() + " Kč"}
                </div>
              </div>
              <div className="dashboard-summary-invoicing-container">
                <div className="dashboard-summary-invoicing-heading">
                  <GiReceiveMoney />
                </div>
                <div className="dashboard-summary-invoicing-count vis-hidden">
                  =
                </div>

                <div className="dashboard-summary-invoicing-count">
                  {salary.toLocaleString() + " Kč"}
                </div>
              </div>
            </div>
            <div className="dashboard-summary-counts">
              <div className="dashboard-summary-counts-container">
                <TbRoad className="dashboard-summary-counts-icon" />
                <div className="dashboard-summary-counts-text">{totalJobs}</div>
              </div>
              <div className="dashboard-summary-counts-container">
                <PiNumberSquareTwoBold className="dashboard-summary-counts-icon" />
                <div className="dashboard-summary-counts-text">
                  {totalSecondJobs}
                </div>
              </div>
              <div className="dashboard-summary-counts-container">
                <PiClockBold className="dashboard-summary-counts-icon" />
                <div className="dashboard-summary-counts-text">
                  {totalWaiting}
                </div>
              </div>
              <div className="dashboard-summary-counts-container">
                <FaUmbrellaBeach className="dashboard-summary-counts-icon dashboard-summary-counts-icon-beach" />
                <div className="dashboard-summary-counts-text">
                  {totalHolidays}
                </div>
              </div>
            </div>
            {currentJobs.length > 0 && (
              <button
                className="dashboard-archive-btn"
                onClick={() => {
                  setShowArchiveModal(true);
                  showJobsToBeArchived();
                }}
              >
                Archivovat nejstarší měsíc
              </button>
            )}
          </section>
          <section className="dashboard-jobs">
            {isLoading2 ? (
              <Spinner />
            ) : (
              <>
                {currentJobs.map((oneJob) => {
                  return <Job key={oneJob.id} jobDetails={oneJob} />;
                })}
              </>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default Dashboard;
