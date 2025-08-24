import React from "react";
import { Download, X } from "lucide-react";

interface CPRSchemaHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CPRSchemaHelpModal: React.FC<CPRSchemaHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const downloadSampleFile = () => {
    const link = document.createElement("a");
    link.href =
      "https://docs.google.com/spreadsheets/d/191Wi1JZmc46qws23oamUCcXHUE27yPCNtvDviDyiATwE/export?format=xlsx"; // Replace with your actual CPR template link
    link.download = "sample_cpr_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-sm max-w-4xl w-full max-h-[95vh] sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              CPR Excel Schema Guidelines
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-gray-700">
          {/* Download Section */}
          <div
            onClick={downloadSampleFile}
            className="p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 active:bg-gray-100 flex flex-col items-start cursor-pointer"
          >
            <span>Start with the official template:</span>
            <div className="flex justify-start mt-3">
              <div className="bg-slate-900 rounded-sm flex items-center justify-center px-4 py-2 text-white gap-2 w-fit group hover:shadow-md transition-shadow">
                <Download
                  className="text-white group-hover:scale-110"
                  size={20}
                />
                Download Sample CPR Template
              </div>
            </div>
          </div>

          {/* Required Format */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Required Format
            </h3>
            <p className="mb-3 text-sm sm:text-base">
              Your Excel file must follow this exact structure for Content
              Progress Reports:
            </p>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto">
              <div className="min-w-[900px]">
                <table className="w-full text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Module
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Topic
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Sub Topic
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Lecture Number
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Lecture Count
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Start Date
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Actual Start Date
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Completion Date
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Actual Completion Date
                      </th>
                      <th className="text-left p-2 font-semibold text-gray-800">
                        Lecture ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-gray-600">
                      <td className="p-2">Programming Basics</td>
                      <td className="p-2">Variables</td>
                      <td className="p-2">Declaration & Initialization</td>
                      <td className="p-2">3</td>
                      <td className="p-2">2</td>
                      <td className="p-2">Completed</td>
                      <td className="p-2">2024-06-03</td>
                      <td className="p-2">2024-06-04</td>
                      <td className="p-2">2024-06-06</td>
                      <td className="p-2">2024-06-07</td>
                      <td className="p-2">L003-L004</td>
                    </tr>
                    <tr className="text-gray-600">
                      <td className="p-2">Programming Basics</td>
                      <td className="p-2">Loops</td>
                      <td className="p-2">For Loop</td>
                      <td className="p-2">5</td>
                      <td className="p-2">3</td>
                      <td className="p-2">In Progress</td>
                      <td className="p-2">2024-06-10</td>
                      <td className="p-2">2024-06-11</td>
                      <td className="p-2">2024-06-14</td>
                      <td className="p-2">-</td>
                      <td className="p-2">L005-L007</td>
                    </tr>
                    <tr className="text-gray-500 text-xs">
                      <td colSpan={11} className="p-2 italic text-center">
                        More rows...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 mt-2 sm:hidden">
                ← Scroll horizontally to see all columns
              </div>
            </div>
          </div>

          {/* Column Specifications */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-900">
              Column Specifications
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">Module:</div>
                <div className="text-gray-600">
                  Broad category (e.g., Programming Basics, OOP, Web Dev)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">Topic:</div>
                <div className="text-gray-600">
                  Main topic within the module (e.g., Variables, Functions)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Sub Topic:
                </div>
                <div className="text-gray-600">
                  Specific concept (e.g., For Loop, String Methods)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Lecture Number:
                </div>
                <div className="text-gray-600">
                  Planned lecture number in sequence (e.g., 1, 2, 3...)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Lecture Count:
                </div>
                <div className="text-gray-600">
                  Number of lectures allocated for this topic (e.g., 2, 3)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">Status:</div>
                <div className="text-gray-600">
                  One of: <code className="bg-white px-1 rounded">Planned</code>
                  , <code className="bg-white px-1 rounded">In Progress</code>,{" "}
                  <code className="bg-white px-1 rounded">Completed</code>,{" "}
                  <code className="bg-white px-1 rounded">Delayed</code>,{" "}
                  <code className="bg-white px-1 rounded">Cancelled</code>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Start Date:
                </div>
                <div className="text-gray-600">
                  Planned start date (format: YYYY-MM-DD)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Actual Start Date:
                </div>
                <div className="text-gray-600">
                  Date when topic was actually started (YYYY-MM-DD) or{" "}
                  <code className="bg-white px-1 rounded">-</code> if not
                  started
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Completion Date:
                </div>
                <div className="text-gray-600">
                  Planned completion date (YYYY-MM-DD)
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Actual Completion Date:
                </div>
                <div className="text-gray-600">
                  Date when topic was completed (YYYY-MM-DD) or{" "}
                  <code className="bg-white px-1 rounded">-</code> if pending
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-800 mb-1">
                  Lecture ID:
                </div>
                <div className="text-gray-600">
                  Unique ID(s) for the lecture(s), e.g., L001, L002-L003
                </div>
              </div>
            </div>
          </div>

          {/* Important Guidelines */}
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
                    <strong>Exact column names</strong>: Must match case and
                    spelling:{" "}
                    <code className="bg-white px-1 rounded">Module</code>,{" "}
                    <code className="bg-white px-1 rounded">
                      Lecture Number
                    </code>
                    ,{" "}
                    <code className="bg-white px-1 rounded">
                      Actual Completion Date
                    </code>
                    , etc.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>First row = headers. No blank rows above.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Dates must be in <strong>YYYY-MM-DD</strong> format (e.g.,
                    2024-06-03)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Status must be one of: Planned, In Progress, Completed,
                    Delayed, Cancelled (case-insensitive)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    Use <code className="bg-white px-1 rounded">-</code> for
                    pending or not applicable dates
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    No merged cells, formulas, or comments in data cells
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>Only the first sheet will be processed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-lg leading-none">
                    •
                  </span>
                  <span>
                    File format: .xls or .xlsx only (no CSV, PDF, or Google
                    Sheets links)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Recommended Workflow */}
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
                    Select CPR details: center, school, division, batch,
                    semester, subject
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    2.
                  </span>
                  <span>Click “View CPR Table” to check existing progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    3.
                  </span>
                  <span>
                    Download the sample template using the button above
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    4.
                  </span>
                  <span>
                    Update{" "}
                    <code className="bg-white px-1 rounded">
                      Actual Start Date
                    </code>
                    ,{" "}
                    <code className="bg-white px-1 rounded">
                      Actual Completion Date
                    </code>
                    , and <code className="bg-white px-1 rounded">Status</code>{" "}
                    weekly
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    5.
                  </span>
                  <span>Save as .xlsx format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-lg leading-none">
                    6.
                  </span>
                  <span>Upload your updated CPR file</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Common Issues */}
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
                    Typo in column name (e.g., “LectureNumber” or “Actl Start
                    Date”)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Invalid date format (e.g., 03/06/24, Jun 3, 3-6-2024)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>
                    Status not in allowed list (e.g., “Ongoing”, “Done”)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Leaving actual dates blank instead of using “-”</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Duplicate or missing lecture numbers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Using merged cells for multi-row topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Uploading an empty or placeholder file</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold text-lg leading-none">
                    ✗
                  </span>
                  <span>Trying to upload a screenshot or PDF version</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
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

export default CPRSchemaHelpModal;
