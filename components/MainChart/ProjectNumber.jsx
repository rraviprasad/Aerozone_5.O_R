import React from "react";

const ProjectNumber = ({ values = [], selectedProject, onSelectProject }) => {
  // ✅ Remove duplicates & ignore empty/null/undefined
  const uniqueValues = [...new Set(values.filter(Boolean))];

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs font-black mb-3 shrink-0 opacity-80">
        Project Numbers
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {uniqueValues.length === 0 ? (
          <div className="text-gray-500 text-sm italic py-2">No data found</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pr-2">
            {uniqueValues.map((item, idx) => {
              const isActive = selectedProject === item;
              return (
                <span
                  key={idx}
                  onClick={() => onSelectProject(item)}
                  className={`
                    px-2 py-1.5 text-xs text-center border rounded-lg cursor-pointer transition-all duration-200 truncate
                    ${isActive
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                      : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-700 text-gray-300 hover:border-blue-500/50"
                    }
                  `}
                  title={item}
                >
                  {item}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectNumber;

// projectNumber: <ProjectNumber

//   values={[...new Set(filteredRows.map(row => row.ProjectCode))]} // unique project codes horizontal
//   selectedProject={selectedRef} // you can also create a new state for project filter
//   onSelectProject={(project) => {
//     setSelectedRef(project);
//     setTimeout(() => applyFilters(), 0);
//   }}
// />,