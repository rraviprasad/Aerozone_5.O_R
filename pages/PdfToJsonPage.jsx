import { useState } from "react";
// Navbar is now global in App.jsx
import "../src/styles/globals.css"; // Import the theme from index.css

export default function PdfToJsonPage() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  // Dynamically load the xlsx library for Excel file generation
  const loadXlsxScript = () => {
    if (document.getElementById('xlsx-script')) return;
    const script = document.createElement('script');
    script.id = 'xlsx-script';
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js";
    document.body.appendChild(script);
  };

  // Call the function to load the script when the component mounts
  // This is a workaround for the single-file environment.
  loadXlsxScript();

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      // Use a custom modal or message box instead of alert()
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      messageBox.innerHTML = `
        <div class="bg-card p-6 rounded-lg shadow-xl text-center">
          <p class="text-foreground">Please select PDF files first!</p>
          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-ring">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    try {
      const res = await fetch("https://pdf-git.onrender.com/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      // Use a custom modal or message box instead of alert()
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      messageBox.innerHTML = `
        <div class="bg-card p-6 rounded-lg shadow-xl text-center">
          <p class="text-foreground">Error uploading files!</p>
          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-ring">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch("https://pdf-git.onrender.com/download");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "indent_data.json";
      a.click();
    } catch (err) {
      // Use a custom modal or message box instead of alert()
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      messageBox.innerHTML = `
        <div class="bg-card p-6 rounded-lg shadow-xl text-center">
          <p class="text-foreground">Error downloading JSON!</p>
          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-ring">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
    }
  };

  const handleDownloadExcel = () => {
    if (!result || !result.indent_data || result.indent_data.length === 0) {
      // Use a custom modal or message box for no data
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      messageBox.innerHTML = `
        <div class="bg-card p-6 rounded-lg shadow-xl text-center">
          <p class="text-foreground">No data to export!</p>
          <button onclick="this.parentElement.parentElement.remove()" class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-ring">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      return;
    }

    const ws = window.XLSX.utils.json_to_sheet(result.indent_data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Extracted Data");
    window.XLSX.writeFile(wb, "indent_data.xlsx");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col font-sans" style={{ height: '100vh' }}>
      {/* Navbar is now global in App.jsx */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-20 w-full max-w-screen-2xl mx-auto pt-2 md:pt-4 px-4 md:px-8 pb-2 space-y-4 animate-fadeIn min-h-0">

        {/* Header Section */}
        <div className="text-center shrink-0">
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-2">
            <span className="text-cyan-300 font-semibold text-[10px] uppercase tracking-widest">Aerozone Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-50 leading-tight mb-1 tracking-tighter">
            Indent <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">PDF Extractor</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs">
            Convert technical PDF documents into structured data with aerospace-grade precision.
          </p>
        </div>

        {/* Centered Upload Card */}
        <div className={`flex justify-center shrink-0 transition-all ${result ? "hidden" : "block"}`}>
          <div className="bg-[#09090b] p-4 md:p-6 rounded-2xl border border-zinc-700/50 shadow-2xl transition-all duration-300 hover:border-cyan-500/30 group w-full max-w-2xl">
            <div className="flex flex-col items-center">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-zinc-50 tracking-tight">Technical Document Upload</h2>
                <p className="text-gray-400 text-xs mt-1">Select PDF files to extract critical part data</p>
              </div>

              <div className="w-full max-w-md">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700/50 rounded-xl cursor-pointer bg-zinc-900/30 hover:bg-zinc-800/50 transition-all duration-300 hover:border-cyan-500/50 relative overflow-hidden group/drop">
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/drop:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center justify-center pt-3 pb-4 relative z-10 text-center px-4">
                    <svg className="w-8 h-8 mb-2 text-gray-500 group-hover/drop:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-1 text-xs text-gray-300">
                      <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[10px] text-gray-500">PDF files up to 20MB</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-4 flex items-center justify-center gap-2 py-2 px-3 bg-zinc-900/50 rounded-lg border border-zinc-800 text-cyan-400 text-xs font-medium animate-slide-up">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                    {files.length} technical file(s) staged
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 w-full max-w-md px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-white shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
              >
                {loading ? (
                  <span className="flex items-center justify-center text-xs">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Pipeline...
                  </span>
                ) : "Execute Extraction Pipeline"}
              </button>
            </div>
          </div>
        </div>

        {/* Extraction Results */}
        {result && (
          <div className="flex-1 flex flex-col justify-start animate-slide-up min-h-0 container max-w-5xl mx-auto px-0">
            <div className="bg-[#09090b] p-4 md:p-6 rounded-2xl border border-[#27272a]/50 shadow-2xl w-full flex-1 flex flex-col min-h-0 h-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12" /><polyline points="7 7 17 7" /><polyline points="7 11 17 11" /><polyline points="7 15 13 15" /></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-50 tracking-tight">Extraction Master Log</h2>
                    <p className="text-gray-400 text-[11px]">System has verified {result.total_items} data points</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleDownload} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg font-bold text-[10px] uppercase tracking-wider text-white flex items-center">
                    JSON Export
                  </button>
                  <button onClick={handleDownloadExcel} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-[10px] uppercase tracking-wider text-white shadow-md">
                    EXCEL MASTER LOG
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
                <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Files Processed</p>
                  <p className="text-xl font-extrabold text-white">{result.total_files_processed}</p>
                </div>
                <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total Items Found</p>
                  <p className="text-xl font-extrabold text-white">{result.total_items}</p>
                </div>
                <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Unique Materials</p>
                  <p className="text-xl font-extrabold text-white">{result.unique_item_codes}</p>
                </div>
              </div>

              {/* Table of Extracted Data */}
              <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                <h3 className="text-sm font-semibold mb-2 text-gray-300 shrink-0">Extracted Data</h3>
                <div className="overflow-auto rounded-lg border border-border w-full flex-1">
                  <table className="min-w-full text-xs box-border">
                    <thead className="bg-secondary text-secondary-foreground sticky top-0 shadow-sm z-10 w-full">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Project No.</th>
                        <th className="px-3 py-2 text-left font-medium">Item Code</th>
                        <th className="px-3 py-2 text-left font-medium">Description</th>
                        <th className="px-3 py-2 text-center font-medium">Qty</th>
                        <th className="px-3 py-2 text-center font-medium">UOM</th>
                        <th className="px-3 py-2 text-center font-medium">Order</th>
                        <th className="px-3 py-2 text-center font-medium">Start Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-[#09090b]">
                      {result.indent_data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-3 py-2 text-foreground">{row.PROJECT_NO || "-"}</td>
                          <td className="px-3 py-2 font-medium text-cyan-400">{row.ITEM_CODE || "-"}</td>
                          <td className="px-3 py-2 text-foreground max-w-[200px] truncate">{row.ITEM_DESCRIPTION || "-"}</td>
                          <td className="px-3 py-2 text-center text-foreground">{row.REQUIRED_QTY || "-"}</td>
                          <td className="px-3 py-2 text-center text-foreground">{row.UOM || "-"}</td>
                          <td className="px-3 py-2 text-center text-foreground">{row.PLANNED_ORDER || "-"}</td>
                          <td className="px-3 py-2 text-center text-foreground">{row.PLANNED_START_DATE || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}