"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Edit, Filter, Search, Trash2, X } from "lucide-react";

interface GenericTableItem {
  id: number | string;
  [key: string]: any;
}

interface ColumnConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "select" | "badge";
  options?: string[];
  badgeColors?: { [key: string]: string };
  searchable?: boolean;
  editable?: boolean;
  hidden?: boolean;
}

interface CustomRenderers {
  [key: string]: (item: GenericTableItem) => React.ReactNode;
}
interface Column {
  accessorKey: string;
  header: string;
}

interface TableProps {
  data: GenericTableItem[];
  title?: string;
  filterField?: string;
  columns?: Column[];
  onEdit?: (item: GenericTableItem) => void;
  onDelete?: (id: number | string) => void;
  rowsPerPage?: number;
  searchPlaceholder?: string;
  filterPlaceholder?: string;
  columnConfig?: Partial<Record<string, Partial<ColumnConfig>>>;
  hiddenColumns?: string[];
  badgeFields?: string[];
  selectFields?: Record<string, string[]>;
  nonEditableFields?: string[];
  customRenderers?: CustomRenderers;
}

const Table: React.FC<TableProps> = ({
  data,
  title = "Data Overview",
  filterField,
  onEdit,
  onDelete,
  rowsPerPage = 5,
  searchPlaceholder = "Search...",
  filterPlaceholder = "All",
  columnConfig = {},
  hiddenColumns = [],
  badgeFields = [],
  selectFields = {},
  nonEditableFields = ["id"],
  customRenderers,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<GenericTableItem | null>(
    null
  );
  const [fieldToDelete, setFieldToDelete] = useState<number | string | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listData, setListData] = useState<GenericTableItem[]>(data);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Auto-generate columns from data
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sampleItem = data[0];
    const autoColumns: ColumnConfig[] = [];

    Object.keys(sampleItem).forEach((key) => {
      if (hiddenColumns.includes(key)) return;

      const sampleValue = sampleItem[key];
      let type: ColumnConfig["type"] = "text";

      if (typeof sampleValue === "number") {
        type = "number";
      } else if (key.toLowerCase().includes("email")) {
        type = "email";
      } else if (badgeFields.includes(key)) {
        type = "badge";
      } else if (selectFields[key]) {
        type = "select";
      }

      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      const column: ColumnConfig = {
        key,
        label,
        type,
        searchable: !["id"].includes(key),
        editable: !nonEditableFields.includes(key),
        ...(selectFields[key] && { options: selectFields[key] }),
        ...columnConfig[key],
      };

      autoColumns.push(column);
    });

    return autoColumns;
  }, [
    data,
    hiddenColumns,
    badgeFields,
    selectFields,
    nonEditableFields,
    columnConfig,
  ]);

  // Get filter options from data
  const filterOptions = useMemo(() => {
    if (!filterField || !data) return [];
    const uniqueValues = [...new Set(data.map((item) => item[filterField]))];
    return uniqueValues.filter(Boolean).sort();
  }, [data, filterField]);

  // Update local data when props change
  useEffect(() => {
    setListData(data);
  }, [data]);

  // Get searchable columns
  const searchableColumns = columns.filter((col) => col.searchable !== false);

  const filteredList = useMemo(() => {
    return listData.filter((item) => {
      // Filter logic
      const matchesFilter =
        !filterField ||
        selectedFilter === "All" ||
        item[filterField] === selectedFilter;

      // Search logic using debounced term
      const matchesSearch =
        !debouncedSearchTerm ||
        searchableColumns.some((col) => {
          const value = item[col.key];
          return String(value)
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase());
        });

      return matchesFilter && matchesSearch;
    });
  }, [
    listData,
    filterField,
    selectedFilter,
    debouncedSearchTerm,
    searchableColumns,
  ]);

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  const paginatedRows = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedFilter]);

  const getBadgeColor = (column: ColumnConfig, value: string) => {
    if (column.badgeColors && column.badgeColors[value]) {
      return column.badgeColors[value];
    }
    const colorMap: { [key: string]: string } = {
      SOT: "bg-blue-100 text-blue-800",
      SOM: "bg-green-100 text-green-800",
      SOH: "bg-purple-100 text-purple-800",
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };

    if (colorMap[value]) {
      return colorMap[value];
    }

    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const index =
      Math.abs(value.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
      colors.length;
    return colors[index];
  };

  const handleDeleteClick = (id: number | string) => {
    setFieldToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fieldToDelete) {
      const updatedData = listData.filter((item) => item.id !== fieldToDelete);
      setListData(updatedData);

      if (onDelete) {
        onDelete(fieldToDelete);
      }

      setDeleteModalOpen(false);
      setFieldToDelete(null);
    }
  };

  const handleEditClick = (item: GenericTableItem) => {
    setEditingField({ ...item });
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField) return;

    const updatedData = listData.map((item) =>
      item.id === editingField.id ? editingField : item
    );
    setListData(updatedData);

    if (onEdit) {
      onEdit(editingField);
    }

    setEditModalOpen(false);
    setEditingField(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingField) return;

    const { name, value } = e.target;
    const column = columns.find((col) => col.key === name);

    let processedValue: any = value;
    if (column?.type === "number") {
      processedValue = parseFloat(value) || 0;
    }

    setEditingField({
      ...editingField,
      [name]: processedValue,
    });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingField(null);
  };

  const handleEditBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeEditModal();
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setFieldToDelete(null);
  };

  const handleDeleteBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeDeleteModal();
    }
  };

  const renderCellContent = (item: GenericTableItem, column: ColumnConfig) => {
    const value = item[column.key];

    switch (column.type) {
      case "badge":
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
              column,
              value
            )}`}
          >
            {value}
          </span>
        );
      case "number":
        return <span className="font-medium">{value}</span>;
      case "email":
        return <span className="text-blue-600">{value}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  const renderEditField = (column: ColumnConfig, value: any) => {
    if (column.editable === false) {
      return (
        <input
          type="text"
          value={value || ""}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 focus:ring-2 focus:ring-slate-900"
        />
      );
    }

    switch (column.type) {
      case "email":
        return (
          <input
            type="email"
            name={column.key}
            value={value || ""}
            onChange={handleEditChange}
            placeholder={column.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900"
          />
        );
      case "number":
        return (
          <input
            type="number"
            name={column.key}
            value={value || ""}
            onChange={handleEditChange}
            placeholder={column.label}
            step={column.key.toLowerCase().includes("cgpa") ? "0.1" : "1"}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900"
          />
        );
      case "select":
        return (
          <select
            name={column.key}
            value={value || ""}
            onChange={handleEditChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm cursor-pointer focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Select {column.label}</option>
            {column.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            name={column.key}
            value={value || ""}
            onChange={handleEditChange}
            placeholder={column.label}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-slate-900"
          />
        );
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 p-8 text-center">
        <p className="text-slate-900">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-sm border border-gray-400 overflow-hidden">
      {/* Edit Modal */}
      {editModalOpen && editingField && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleEditBackdropClick}
        >
          <div className="bg-white rounded-sm max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-400">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Edit Record</h3>
              <button
                onClick={closeEditModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <form
              onSubmit={handleEditSubmit}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {columns.map((column) => (
                    <div key={column.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {column.label}
                      </label>
                      {renderEditField(column, editingField[column.key])}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer - Fixed at bottom */}
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-sm">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleDeleteBackdropClick}
        >
          <div className="bg-white rounded-sm border border-gray-400 max-w-md w-full shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h3>
              <button
                onClick={closeDeleteModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this record? This action cannot
                be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-sm">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h4 className="text-xl font-bold text-gray-800">{title}</h4>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
              />
            </div>

            {filterField && filterOptions.length > 0 && (
              <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
                >
                  <option value="All">{filterPlaceholder}</option>
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRows.map((item) => (
                <tr
                  key={`item.id+${Math.random()}`}
                  className="hover:bg-gray-50"
                >
                  {columns.map((column) => {
                    if (customRenderers && customRenderers[column.key]) {
                      return (
                        <td
                          key={column.key}
                          className="py-3 px-4 text-gray-600 whitespace-nowrap"
                        >
                          {customRenderers[column.key](item)}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={column.key}
                        className="py-3 px-4 text-gray-600 whitespace-nowrap"
                      >
                        {renderCellContent(item, column)}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedRows.length === 0 && (
          <div className="text-center py-8 text-gray-500">No records found</div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {paginatedRows.length} of {filteredList.length} records
            {selectedFilter !== "All" && ` filtered by ${selectedFilter}`}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-[#1B3A6A] text-white hover:bg-[#2d4f7a] transition-colors duration-200 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-[#1B3A6A] text-white hover:bg-[#2d4f7a] transition-colors duration-200 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
