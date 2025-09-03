export interface ColumnDescription {
  key: string;
  description: string;
}

export interface SchemaInfo {
  title: string;
  columns: string[];
  sampleRow: string[];
  columnDescriptions: ColumnDescription[];
  guidelines: string[];
  commonIssues: string[];
  downloadLink: string;
}

export const studentSchemaInfo: SchemaInfo = {
  title: "Student Upload",
  columns: ["name", "email", "phone", "enrollment_id", "gender"],
  sampleRow: [
    "Aarav Kumar",
    "aarav.kumar@pwioi.com",
    "9876543210",
    "PATSOT23B1001001",
    "Male",
  ],
  columnDescriptions: [
    { key: "name", description: "Full name of the student" },
    { key: "email", description: "Valid email address of the student" },
    { key: "phone", description: "10-digit phone number without country code" },
    {
      key: "enrollment_id",
      description: "Unique enrollment ID assigned to the student",
    },
    { key: "gender", description: "Gender: Male, Female, or Other" },
  ],
  guidelines: [
    "Column headers must match exactly as shown (case-sensitive).",
    "All fields are required; no empty cells allowed.",
    "Email must be valid and unique.",
    "Phone number must be exactly 10 digits.",
    "Enrollment ID should be unique across all students.",
    "Gender must be one of: Male, Female, Other.",
  ],
  commonIssues: [
    "Using incorrect column names like 'phoneNumber' instead of 'phone'.",
    "Missing required fields (e.g., empty email or enrollment ID).",
    "Invalid phone numbers (less than or more than 10 digits).",
    "Duplicate enrollment IDs.",
    "Invalid email formats (e.g., missing '@' or domain).",
    "Extra columns or rows in the file.",
  ],
  downloadLink:
    "https://docs.google.com/spreadsheets/d/1lnjHiquehsluIPirxm4gR8ckjbK2Rw_pfIJixEKJ4g4/export?format=xlsx",
};

export default studentSchemaInfo;
