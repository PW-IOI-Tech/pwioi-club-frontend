import { Mail, Phone } from "lucide-react";

export const helpItems = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us during business hours (9 AM - 6 PM)",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your queries via email",
    action: "Send Email",
  },
];

export const faqs = [
  {
    question: "How do I upload course materials for my students?",
    answer:
      "You can upload lecture notes, assignments, and supplementary resources through the Faculty Portal under the 'Courses' section. Select the relevant course and use the 'Upload Materials' option to share content with your students.",
  },
  {
    question: "How do I take attendance for my classes?",
    answer:
      "Attendance can be marked through the Faculty Dashboard in the 'Attendance' section. Select the course and date, then mark students as present, absent, or late. The attendance record is updated in real-time and accessible by students and administrators.",
  },
  {
    question: "How can I evaluate and grade student submissions?",
    answer:
      "Go to the 'Assignments' tab in your Faculty Portal. You can view, evaluate, and provide feedback on student submissions. Grades entered here are automatically synced with the academic record system.",
  },
  {
    question: "How do I apply for academic or casual leave?",
    answer:
      "To apply for leave, navigate to the 'Leave Application' section in the HR Portal. Fill in the required details, upload supporting documents if needed, and submit. You'll receive a notification once your application is reviewed and approved.",
  },
  {
    question: "Where can I access student performance reports?",
    answer:
      "Student performance reports are available in the 'Reports' section of your Faculty Dashboard. You can filter by course, semester, or student ID to view detailed analytics on attendance, grades, and participation.",
  },
  {
    question: "How do I update my faculty profile?",
    answer:
      "You can update your profile by clicking on 'My Profile' in the Faculty Portal. Fields such as qualifications, areas of research, and contact information can be edited. Some changes may require approval from the department head.",
  },
];
