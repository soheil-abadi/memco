import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Joyride, { Step } from "react-joyride";
import { HiMenuAlt2 } from "react-icons/hi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initialData = [
  { Name: "Task1", Date: "2025-04-01", Value: 120, "New Value": 80 },
  { Name: "Task2", Date: "2025-05-02", Value: 90, "New Value": 78 },
  { Name: "Task3", Date: "2025-06-02", Value: 45, "New Value": 69 },
  { Name: "Task5", Date: "2025-07-02", Value: 22, "New Value": 45 },
  { Name: "Task6", Date: "2025-08-02", Value: 17, "New Value": 14 },
  { Name: "Task7", Date: "2025-09-02", Value: 53, "New Value": 97 },
  { Name: "Task8", Date: "2025-10-02", Value: 75, "New Value": 44 },
  { Name: "Task9", Date: "2025-11-02", Value: 11, "New Value": 66 },
  { Name: "Task10", Date: "2025-12-02", Value: 22, "New Value": 52 },
];

const allParameters = [
  "Name",
  "Date",
  "Value",
  "New Value",
  "New Date",
  "Category",
];

export const Dashboard = () => {
  const [columns, setColumns] = useState<string[]>(["Name", "Date", "Value"]);
  const [fullData, setFullData] = useState(initialData);
  const data = fullData;
  const [parameters, setParameters] = useState<string[]>(
    allParameters.filter((p) => !["Name", "Date", "Value"].includes(p))
  );

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [pendingParam, setPendingParam] = useState<string | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"add" | "remove">("add");
  const [runTour, setRunTour] = useState(true);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
    if (open) {
      setRunTour(true);
    }
  };

  const tourSteps: Step[] = [
    {
      target: ".joyride-sidebar",
      content: "Welcome to the Dashboard! Use this menu to navigate.",
      disableBeacon: true,
    },
    {
      target: ".joyride-parameters",
      content: "Drag parameters from here to the table to add them.",
    },
    {
      target: ".joyride-table",
      content: "Drop parameters into the table to view and chart them.",
    },
    {
      target: ".joyride-chart",
      content: "This chart updates with the selected parameters.",
    },
  ];

  const handleDropToTable = (e: React.DragEvent<HTMLDivElement>) => {
    const param = e.dataTransfer.getData("text");
    if (!columns.includes(param)) {
      setPendingParam(param);
      setActionType("add");
      setOpenConfirmModal(true);
    }
  };

  const handleDropToParameters = (e: React.DragEvent<HTMLDivElement>) => {
    const param = e.dataTransfer.getData("text");
    if (columns.includes(param) && param !== "Name") {
      setPendingParam(param);
      setActionType("remove");
      setOpenConfirmModal(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const confirmColumnChange = () => {
    if (!pendingParam) return;
    const param = pendingParam;
    if (actionType === "add") {
      setColumns([...columns, param]);
      setParameters(parameters.filter((p) => p !== param));
      const hasParam = fullData.every((row) => param in row);
      if (!hasParam) {
        setFullData(
          fullData.map((row) => ({
            ...row,
            [param]:
              param === "New Value"
                ? Math.floor(Math.random() * 100) + 50
                : param === "New Date"
                ? new Date().toISOString().split("T")[0]
                : "Category A",
          }))
        );
      }
    } else {
      setColumns(columns.filter((c) => c !== param));
      setParameters([...parameters, param]);
    }
    setPendingParam(null);
    setOpenConfirmModal(false);
  };

  const cancelColumnChange = () => {
    setPendingParam(null);
    setOpenConfirmModal(false);
  };

  const visibleDatasets = columns.filter((col) =>
    ["Value", "New Value"].includes(col)
  );

  const chartData = {
    labels: data.map((d) => d.Date),
    datasets: visibleDatasets.map((key) => ({
      label: key,
      data: data.map((d: any) => d[key] || 0),
      borderColor: key === "Value" ? "#3b82f6" : "#10b981",
      backgroundColor:
        key === "Value" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)",
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Multi-Series Line Chart" },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {!drawerOpen && (
        <div className="p-4">
          <IconButton onClick={toggleDrawer(true)} className="text-white">
            <HiMenuAlt2 className="text-white rounded-full bg-gray-800  p-2 text-5xl" />
          </IconButton>
        </div>
      )}

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{ paper: "bg-gray-800 text-white" }}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 256,
            boxSizing: "border-box",
            backgroundColor: "#1f2937",
            color: "white",
          },
        }}
      >
        <div className="p-6 space-y-6 joyride-sidebar h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-2">📊 Dashboard</h1>
          <nav className="flex-1">
            <ul className="space-y-3 text-base">
              {["Home", "Reports", "Charts", "Settings"].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer px-3 py-2 rounded-lg transition hover:bg-gray-700 hover:text-blue-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <Button
            onClick={toggleDrawer(false)}
            variant="outlined"
            sx={{
              borderColor: "#60a5fa",
              color: "#60a5fa",
              "&:hover": {
                backgroundColor: "#1e40af",
                borderColor: "#3b82f6",
                color: "white",
              },
            }}
          >
            Close
          </Button>
        </div>
      </Drawer>

      <Joyride
        steps={tourSteps}
        run={runTour}
        showSkipButton
        showProgress
        continuous
        styles={{
          options: {
            primaryColor: "#3b82f6",
            textColor: "#fff",
            backgroundColor: "#333",
            zIndex: 10000,
            overlayColor: "rgba(0, 0, 0, 0.7)",
            arrowColor: "#333",
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped") {
            setRunTour(false);
          }
        }}
      />

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="main-content"
            className={`flex-1 transition-all duration-300 ml-64`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex w-full">
              <motion.div
                onDrop={handleDropToParameters}
                onDragOver={handleDragOver}
                className="w-48 bg-gray-800 border-r border-gray-700 p-4 joyride-parameters"
              >
                <h2 className="text-lg font-semibold mb-3">Parameters</h2>
                <ul className="space-y-3">
                  {parameters.map((param) => (
                    <motion.li
                      key={param}
                      draggable
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onDragStart={(e: any) =>
                        e.dataTransfer.setData("text", param)
                      }
                      className="bg-gray-700 text-white p-2 rounded shadow-md cursor-grab hover:bg-blue-500"
                    >
                      {param}
                    </motion.li>
                  ))}
                </ul>
                <ReactTooltip place="right" />
              </motion.div>

              <div className="flex-1 p-6 space-y-6">
                <motion.div
                  onDrop={handleDropToTable}
                  onDragOver={handleDragOver}
                  className="bg-gray-800 p-4 rounded-xl shadow-md overflow-auto joyride-table"
                >
                  <h2 className="text-lg font-semibold mb-3">Data Table</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-2 text-left text-gray-300"
                            >
                              <div
                                className="flex justify-between items-center"
                                draggable={col !== "Name"}
                                onDragStart={(e) =>
                                  col !== "Name" &&
                                  e.dataTransfer.setData("text", col)
                                }
                              >
                                {col}
                                {!["Name"].includes(col) && (
                                  <button
                                    onClick={() => {
                                      setPendingParam(col);
                                      setActionType("remove");
                                      setOpenConfirmModal(true);
                                    }}
                                    className="ml-2 text-red-400 hover:text-red-600"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <AnimatePresence>
                        <tbody>
                          {data.map((row: any, idx) => (
                            <motion.tr
                              key={idx}
                              className="border-t border-gray-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {columns.map((col) => (
                                <td key={col} className="px-4 py-2">
                                  {row[col]}
                                </td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </AnimatePresence>
                    </table>
                  </div>
                </motion.div>

                <motion.div className="bg-gray-800 p-4 rounded-xl shadow-md joyride-chart">
                  <h2 className="text-lg font-semibold mb-3">Chart</h2>
                  <Line
                    className="max-w-[100%] max-h-[100%]"
                    data={chartData}
                    options={options}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={openConfirmModal}
        onClose={cancelColumnChange}
        PaperProps={{
          sx: {
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        }}
      >
        {" "}
        <DialogTitle>
          {actionType === "add" ? "Confirm Add" : "Confirm Remove"}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {actionType} <strong>{pendingParam}</strong>
          {actionType === "add" ? " to" : " from"} your table?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelColumnChange} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmColumnChange}
            color="primary"
            variant="contained"
          >
            {actionType === "add" ? "Add" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
