export type JobType = {
  basePlace: string;
  city: string;
  cmr: string;
  date: string;
  day: string;
  id: string;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  timestamp: number;
  waiting: number;
  weight: number;
  zipcode: string;
};

export interface Job {
  basePlace: string;
  city: string;
  cmr: string;
  date: string;
  id: string;
  isHoliday: boolean;
  isSecondJob: boolean;
  note: string;
  price: number;
  timestamp: number;
  waiting: number;
  weight: number;
  zipcode: string;
}
export type ArchiveType = {
  date: string;
  jobs: JobType[];
  eurCzkRate: number;
};

export type userSettingsType = {
  basePlace: string;
  email: string;
  eurCzkRate: number;
  nameFirst: string;
  nameSecond: string;
  numberEm: string;
  numberTrailer: string;
  numberTruck: string;
  referenceId: string;
};

export interface UserSettings {
  basePlace: string;
  email: string;
  eurCzkRate: number;
  nameFirst: string;
  nameSecond: string;
  numberEm: string;
  numberTrailer: string;
  numberTruck: string;
  referenceId: string;
}

export type ArchiveMonthSummaryType = {
  date: string;
  summaryEur: number;
  summaryCzk: number;
  summarySecondJobs: number;
  summaryWaiting: number;

  summaryJobs: number;
  summaryHolidays: number;
  summaryEurCzkRate: number;
  jobs: JobType[];
};

export type InfoMessage = {
  date: string;
  text: string;
  title: string;
};

export interface LoggedInUserData {
  archivedJobs: any[];
  currentJobs: any[];
  userSettings: UserSettings;
}

export interface JobToAdd {
  city: string;
  price: number;
  weight: number;
  basePlace: string;
  zipcode: string;
}

export interface ArchiveMonthSummarySettings {
  date: string;
  baseMoney: number;
  percentage: number;
  secondJobBenefit: number;
  waitingBenefitEmployerCzk: number;
  waitingBenefitEur: number;
  eurCzkRate: number;
}

export interface AuthState {
  infoMessage: string | null;
  infoMessages: InfoMessage[] | null;
  toast: {
    isVisible: boolean;
    message: string;
    style: string;
    time: number;
    resetToast: boolean;
  };
  isLoading: boolean;
  isLoading2: boolean;
  isLoginPending: boolean;
  isLoggedIn: boolean;
  isRegisterPending: boolean;
  isRegisterReduxSuccess: boolean;
  isChangeEmailReduxSuccess: boolean;
  isChangePasswordReduxSuccess: boolean;
  isPasswordResetSuccess: boolean;
  isLogoutReduxSuccess: boolean;
  isAccountDeletingPending: boolean;
  isAccountDisabled: boolean;
  isDeleteAccountReduxSuccess: boolean;
  isChangeSettingsReduxSuccess: boolean;
  isAddJobReduxSuccess: boolean;
  isEditJobReduxSuccess: boolean;
  isEditArchiveJobReduxSuccess: boolean;
  isArchiveDoneJobsAllCasesReduxSuccess: boolean;
  isEditArchiveMonthSummarySettingsReduxSuccess: boolean;
  loggedInUserEmail: string | null;
  loggedInUserUid: string | null;
  loggedInUserData: LoggedInUserData;
  jobToAdd: JobToAdd;
  isEditing: boolean;
  isEditingArchivedJob: boolean;
  jobToEdit: Job;
  archiveMonthSummarySettingsToEdit: ArchiveMonthSummarySettings;
}
