import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import DashboardSummaryPage from "./pages/DashboardSummaryPage";
import TransactionListPage from "./pages/TransactionListPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import MonthlyChartPage from "./pages/MonthlyChartPage";
import CategoryChartPage from "./pages/CategoryChartPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-4">
        <Routes>
          <Route path="/" element={<DashboardSummaryPage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/monthly-chart" element={<MonthlyChartPage />} />
          <Route path="/category-chart" element={<CategoryChartPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


