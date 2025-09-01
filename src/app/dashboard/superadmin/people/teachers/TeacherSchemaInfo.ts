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

export const teacherSchemaInfo: SchemaInfo = {
  title: "Teacher Upload",
  columns: ["name", "email", "phone", "gender", "role"],
  sampleRow: [
    "Jane Smith",
    "jane.smith@pwioi.com",
    "9876543210",
    "Female",
    "TEACHER",
  ],
  columnDescriptions: [
    { key: "name", description: "Full name of the teacher" },
    { key: "email", description: "Valid email address of the teacher" },
    { key: "phone", description: "10-digit phone number without country code" },
    { key: "gender", description: "Gender: MALE or FEMALE" },
    { key: "role", description: "Role: TEACHER or ASSISTANT_TEACHER" },
  ],
  guidelines: [
    "Column headers must match exactly (case-sensitive).",
    "All fields are required; no empty cells allowed.",
    "Email must be valid and unique.",
    "Phone number must be exactly 10 digits.",
    "Gender must be either 'MALE' or 'FEMALE' (uppercase).",
    "Role must be one of: 'TEACHER' or 'ASSISTANT_TEACHER' (uppercase).",
  ],
  commonIssues: [
    "Using lowercase values like 'male' instead of 'MALE'.",
    "Misspelled role names (e.g., 'Teacher', 'Assitant_Teacher').",
    "Invalid phone numbers (e.g., +91 or 11 digits).",
    "Duplicate email addresses.",
    "Missing required columns like 'role' or 'phone'.",
    "Extra spaces or hidden characters in data cells.",
  ],
  downloadLink:
    "https://docs.google.com/spreadsheets/d/1OpEbFlZUP6QouihirTssXupvO6SrC0T8wWj4-tyFa1c/export?format=xlsx",
};

export default teacherSchemaInfo;
