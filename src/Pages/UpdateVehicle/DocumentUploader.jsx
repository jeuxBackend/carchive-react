import { useId } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X } from "lucide-react";

const DocumentUploader = ({ value = [], setValue, documentView = [], setDocumentView }) => {
  const { theme } = useTheme();
  const inputId = useId();

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // For files, keep the actual file object for upload
      const newDocuments = files.map(file => file);
      
      // For preview, create object URLs for new files
      const newDocPreviews = files.map(file => 
        file.type.startsWith("image") ? URL.createObjectURL(file) : file.name
      );
      
      // Update both the actual files and their previews
      setValue([...value, ...newDocuments]);
      setDocumentView([...documentView, ...newDocPreviews]);
    }
  };

  const removeDocument = (index) => {
    setValue(value.filter((_, i) => i !== index));
    setDocumentView(documentView.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin">
        <div className="flex gap-3 p-2 w-max">
          {documentView.map((doc, index) => (
            <div key={index} className="relative w-36 flex-shrink-0 rounded-lg flex items-center justify-between">
              {typeof doc === 'string' && (doc.startsWith('http') || doc.startsWith('blob')) ? (
                <motion.img
                  src={doc}
                  alt="Uploaded"
                  className="w-36 h-28 object-cover rounded-lg border border-gray-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.div
                  className={`w-36 h-28 flex items-center justify-center rounded-lg border border-gray-300 ${
                    theme === "dark" ? "bg-[#282929] text-white" : "bg-[#f7f7f7] text-black"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-sm text-center px-2 truncate">{doc}</p>
                </motion.div>
              )}
              <button
                onClick={() => removeDocument(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <motion.div
            className={`w-36 h-28 flex items-center justify-center rounded-lg cursor-pointer border border-dashed flex-shrink-0 ${
              theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7]"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => document.getElementById(inputId).click()}
          >
            <img
              src={theme === "dark" ? add : addLight}
              className="w-[3rem]"
              alt="Add"
            />
          </motion.div>
        </div>
      </div>

      <input
        type="file"
        multiple
        onChange={handleDocumentChange}
        className="hidden"
        id={inputId}
      />
    </div>
  );
};

export default DocumentUploader;