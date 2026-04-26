import { PinIcon } from "lucide-react";
import React, { useState, useRef } from "react";

export default function Uploadfrom2({ onUpload }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage("");
    }
  };

  const selectFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProceed = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first!");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      await onUpload(file);
      setMessage(`✅ ${file.name} processed successfully!`);
      setFile(null); // Clear after success
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Error processing file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--primary)]/20 shadow p-6 max-w-lg">
      <div className="flex items-center mb-4">
        <div className="h-6 w-1 bg-[var(--primary)] mr-3"></div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          Upload Excel File
        </h2>
      </div>

      <p className="text-[var(--muted-foreground)] mb-6">
        Select and process your Excel file.
      </p>

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={selectFileInput}
        disabled={isProcessing}
        className="w-full bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] py-3 px-6 rounded-lg mb-4 transition shadow disabled:opacity-50"
      >
        {file ? "Change File" : "Select File"}
      </button>

      {file && (
        <div className="text-sm text-[var(--primary)] mb-4 font-mono text-center flex items-center justify-center gap-2">
          <span className="truncate max-w-[200px]">{file.name}</span>
          <span className="text-[10px] bg-[var(--primary)]/10 px-2 py-0.5 rounded">Ready</span>
        </div>
      )}

      <button
        onClick={handleProceed}
        disabled={!file || isProcessing}
        className="w-full bg-[var(--success)] hover:opacity-90 text-[var(--success-foreground)] py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin text-lg">⏳</span>
            Processing...
          </>
        ) : (
          "Process Data"
        )}
      </button>

      {message && (
        <p className={`mt-4 p-3 rounded-lg text-center text-sm border ${
          message.startsWith("✅") 
            ? "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]" 
            : "bg-red-500/10 border-red-500/30 text-red-500"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
