import { useId, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X, Calendar, Edit3, FileText, Image } from "lucide-react";

const DocumentUploader = ({ value = [], setValue, type, setAdditionalDates, setAdditionalTitles }) => {
  const { theme } = useTheme();
  const inputId = useId();
  const [documentView, setDocumentView] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [additionalTitles, setLocalAdditionalTitles] = useState([]);
  const [additionalDates, setLocalAdditionalDates] = useState([]);

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Filter only images and PDFs
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";
      return isImage || isPDF;
    });

    if (validFiles.length > 0) {
      if (type === "additional") {
        // Show modal for additional type
        setPendingFiles(validFiles);
        setShowModal(true);
        setModalTitle("");
        setModalDate("");
        setEditIndex(null);
      } else {
        // Handle normally for other types
        const newDocuments = validFiles.map((file) => file);
        const documentPreviews = validFiles.map((file) => 
          file.type.startsWith("image") ? URL.createObjectURL(file) : file.name
        );

        setValue([...value, ...newDocuments]);
        setDocumentView([...documentView, ...documentPreviews]);
      }
    }
    
    // Show alert if some files were invalid
    if (files.length > validFiles.length) {
      alert("Only images and PDF files are allowed. Some files were filtered out.");
    }
    
    // Reset the input
    event.target.value = '';
  };

  const handleModalSubmit = () => {
    const title = modalTitle.trim() || "No Title";
    const date = modalDate || "No Date";
    
    if (editIndex !== null) {
      // Edit existing document
      const newTitles = [...additionalTitles];
      const newDates = [...additionalDates];
      newTitles[editIndex] = title;
      newDates[editIndex] = date;
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    } else {
      // Add new documents
      const newDocuments = pendingFiles.map((file) => file);
      const documentPreviews = pendingFiles.map((file) => 
        file.type.startsWith("image") ? URL.createObjectURL(file) : file.name
      );

      setValue([...value, ...newDocuments]);
      setDocumentView([...documentView, ...documentPreviews]);
      
      // Update additional titles and dates arrays
      const newTitles = [...additionalTitles, ...pendingFiles.map(() => title)];
      const newDates = [...additionalDates, ...pendingFiles.map(() => date)];
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    }

    // Reset modal state
    setShowModal(false);
    setPendingFiles([]);
    setModalTitle("");
    setModalDate("");
    setEditIndex(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setPendingFiles([]);
    setModalTitle("");
    setModalDate("");
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setModalTitle(additionalTitles[index] === "No Title" ? "" : additionalTitles[index]);
    setModalDate(additionalDates[index] === "No Date" ? "" : additionalDates[index]);
    setShowModal(true);
  };

  const removeDocument = (index) => {
    setValue(value.filter((_, i) => i !== index));
    setDocumentView(documentView.filter((_, i) => i !== index));
    
    // Also remove from additional arrays if they exist
    if (type === "additional") {
      const newTitles = additionalTitles.filter((_, i) => i !== index);
      const newDates = additionalDates.filter((_, i) => i !== index);
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "No Date") return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isImage = (doc, index) => {
    if (typeof doc === 'string' && doc.startsWith('blob:')) return true;
    if (value[index] && value[index].type) {
      return value[index].type.startsWith('image/');
    }
    return false;
  };

  const isPDF = (doc, index) => {
    if (value[index] && value[index].type) {
      return value[index].type === 'application/pdf';
    }
    return typeof doc === 'string' && doc.endsWith('.pdf');
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin">
        <div className="flex gap-3 p-2 w-max">
          {documentView.map((doc, index) => (
            <div key={index} className="relative w-40 flex-shrink-0 rounded-xl overflow-hidden">
              <motion.div
                className={`w-40 h-32 rounded-xl border-2 overflow-hidden ${
                  theme === "dark" ? "border-gray-600 bg-[#2a2b2d]" : "border-gray-200 bg-white"
                } shadow-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isImage(doc, index) ? (
                  <img
                    src={doc}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3">
                    <FileText size={24} className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
                    <span className={`text-xs mt-2 text-center truncate w-full ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {typeof doc === 'string' ? doc : 'PDF File'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Document Info Overlay */}
              {type === "additional" && additionalTitles[index] && (
                <div className={`absolute bottom-0 left-0 right-0 p-2 ${
                  theme === "dark" ? "bg-black/70" : "bg-white/90"
                } backdrop-blur-sm`}>
                  <div className="text-xs font-medium truncate text-blue-500">
                    {additionalTitles[index]}
                  </div>
                  {additionalDates[index] && additionalDates[index] !== "No Date" && (
                    <div className="flex items-center gap-1 text-xs opacity-75 text-blue-500">
                      <Calendar size={10} />
                      {formatDate(additionalDates[index])}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-1">
                {type === "additional" && (
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
                <button
                  onClick={() => removeDocument(index)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          <motion.div
            className={`w-40 h-32 flex flex-col items-center justify-center rounded-xl cursor-pointer border-2 border-dashed flex-shrink-0 transition-colors hover:border-blue-400 ${
              theme === "dark" ? "bg-[#1b1c1e] border-gray-600" : "bg-[#f7f7f7] border-gray-300"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => document.getElementById(inputId).click()}
          >
            <img
              src={theme === "dark" ? add : addLight}
              className="w-12 h-12 mb-2"
              alt="Add"
            />
            <span className={`text-xs text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Images & PDFs
            </span>
          </motion.div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleDocumentChange}
        className="hidden"
        id={inputId}
      />

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className={`rounded-2xl shadow-2xl w-full max-w-md ${
              theme === "dark" ? "bg-[#2a2b2d] text-white" : "bg-white text-black"
            }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
                }`}>
                  {editIndex !== null ? <Edit3 size={20} className="text-blue-500" /> : <FileText size={20} className="text-blue-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {editIndex !== null ? "Edit Document" : "Add Document Details"}
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {editIndex !== null ? "Update title and date" : "Provide title and date for your document"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <FileText size={16} />
                  Document Title
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === "dark" 
                      ? "bg-[#1b1c1e] border-gray-600 text-white placeholder-gray-400 hover:border-gray-500" 
                      : "bg-gray-50 border-gray-200 text-black placeholder-gray-500 hover:border-gray-300"
                  }`}
                />
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Leave empty to use "No Title"
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Calendar size={16} />
                  Document Date
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === "dark" 
                      ? "bg-[#1b1c1e] border-gray-600 text-white hover:border-gray-500" 
                      : "bg-gray-50 border-gray-200 text-black hover:border-gray-300"
                  }`}
                />
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Leave empty to use "No Date"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex gap-3 justify-end ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <button
                onClick={handleModalCancel}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                  theme === "dark" 
                    ? "border-gray-600 text-gray-300 hover:bg-[#1b1c1e] hover:border-gray-500" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {editIndex !== null ? "Update" : "Add Document"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;