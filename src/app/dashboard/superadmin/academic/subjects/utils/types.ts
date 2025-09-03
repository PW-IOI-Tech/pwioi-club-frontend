
export interface Center {
  id: string;
  name: string;
  location: string;
  code: string;
}

export interface School {
  id: string;
  name: string;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
}

export interface Division {
  id: string;
  code: string;
  name: string;
}

export interface Semester {
  id: string;
  number: number;
  name: string;
}

export interface TableSubject {
  id: string;
  subjectName: string;
  credits: string;
  subjectCode: string;
  teacher: string;
  school: string;
  batch: string;
  division: string;
  semester: number;
  center: string;
}

export interface FilterState {
  selectedCenterId: string;
  selectedCenterName?: string;
  selectedSchoolId: string;
  selectedBatchId: string;
  selectedDivisionId: string;
  selectedSemesterId: string;
}

export interface LoadingState {
  centersLoading: boolean;
  schoolsLoading: boolean;
  batchesLoading: boolean;
  divisionsLoading: boolean;
  semestersLoading: boolean;
}
