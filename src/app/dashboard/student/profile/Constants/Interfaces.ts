interface SocialLink {
  platform: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  name: string;
  organisation: string;
  startDate: string;
  endDate: string;
  link: string;
}

interface Achievement {
  title: string;
  description: string;
  organisation: string;
  startDate: string;
}

interface AcademicHistory {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade: number;
  startDate: string;
  endDate: string;
}

interface ProfileData {
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    enrollmentId: string;
    centerId: string;
    schoolId: string;
    batchId: string;
    semesterId: string;
    divisionId: string;
    profileImage: string | null;
  };
  degreePartner: {
    collegeName: string;
    degreeName: string;
    specialization: string;
    startDate: string;
    endDate: string;
  };
  personalDetails: {
    personalEmail: string;
    fathersName: string;
    mothersName: string;
    fathersContact: string;
    mothersContact: string;
    fathersOccupation: string;
    mothersOccupation: string;
  };
  socialLinks: SocialLink[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  academicHistory: AcademicHistory[];
}

export default ProfileData;
