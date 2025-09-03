import React from "react";
import { Download, X } from "lucide-react";

interface SchemaHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchemaHelpModal: React.FC<SchemaHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/spreadsheets/d/191Wi1JZmc46qws23oamUCcXHUE27yPCNtvDviDyATwE/export?format=xlsx";
    link.download = "sample_test_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-sm max-w-2xl w-full max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Excel File Schema Guidelines
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-gray-700">
          <div
            onClick={downloadSampleFile}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 active:bg-gray-100 flex items-start flex-col"
          >
            Click the button below to download a Sample Excel File
            <div className="flex justify-start cursor-pointer">
              <div className=" bg-slate-900 rounded-sm flex items-center justify-center mx-auto mb-3 w-fit p-2 mt-2 text-white gap-2 px-4 group">
                <Download
                  className="text-white group-hover:scale-110"
                  size={20}
                />
                Download
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Required Format
            </h3>
            <p className="mb-3 text-sm sm:text-base">
              Your Excel file should follow this exact structure for student
              exam data:
            </p>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto">
              <div className="min-w-[600px]">
                <table className="w-full text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 font-semibold text-gray-800">
                        enrollment_id
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        student_name
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        marks_obtained
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        is_present
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-600">
                      <td className="p-2">2023SOT001</td>
                      <td className="p-2">John Doe</td>
                      <td className="p-2">85</td>
                      <td className="p-2">TRUE</td>
                      <td className="p-2">Good performance</td>
                    </tr>
                    <tr className="text-gray-600">
                      <td className="p-2">2023SOT002</td>
                      <td className="p-2">Jane Smith</td>
                      <td className="p-2">0</td>
                      <td className="p-2">FALSE</td>
                      <td className="p-2">Absent</td>
                    </tr>
                    <tr className="text-gray-500 text-xs">
                      <td className="p-2 italic">More rows...</td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                      <td className="p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-2 sm:hidden">
                ← Scroll horizontally to see all columns
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Column Specifications
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  enrollment_id:
                </div>
                <div className="text-gray-600">
                  Student enrollment ID as provided in the students list (e.g.,
                  2023SOT001)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  student_name:
                </div>
                <div className="text-gray-600">
                  Full name of the student (e.g., John Doe)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  marks_obtained:
                </div>
                <div className="text-gray-600">
                  Marks scored by the student (numeric value, use 0 for absent
                  students)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  is_present:
                </div>
                <div className="text-gray-600">
                  Student attendance status (TRUE for present, FALSE for absent)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">remarks:</div>
                <div className="text-gray-600">
                  Additional comments or notes about the student&lsquo;s performance
                  (optional)
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Important Guidelines
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Column headers must match exactly: enrollment_id,
                    student_name, marks_obtained, is_present, remarks
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>First row should contain column headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Data should start from the second row</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Use TRUE/FALSE for is_present column (case-insensitive)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Marks should be numeric values only (use 0 for absent
                    students)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Enrollment IDs must match the provided students list
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>No empty rows between data entries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Supported formats: .xls and .xlsx</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Recommended Workflow
            </h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    1.
                  </span>
                  <span>
                    Select exam details (school, batch, division, semester,
                    subject)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    2.
                  </span>
                  <span>
                    Click &ldquo;Get Students List&ldquo; to see enrolled students
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    3.
                  </span>
                  <span>
                    Use &ldquo;Copy for Excel&ldquo; to get the template with student data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    4.
                  </span>
                  <span>
                    Paste into Excel and fill in marks_obtained, is_present, and
                    remarks
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    5.
                  </span>
                  <span>Select exam type and exam number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    6.
                  </span>
                  <span>Upload your completed Excel file</span>
                </li>
              </ol>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Common Issues to Avoid
            </h3>
            <div className="bg-red-50 p-4 rounded-lg">
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Using different column header names (must be exact match)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Non-numeric values in marks_obtained column</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Using values other than TRUE/FALSE in is_present column
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Enrollment IDs that don&lsquo;t match the students list</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Merged cells in data area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Multiple sheets (only first sheet will be processed)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Formulas in data cells (use values only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Missing required exam details before upload</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors duration-200 ease-in-out cursor-pointer font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaHelpModal;
