import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import DashboardContainer from "./components/dashboard/DashboardContainer";
import TransactionsPage from "./components/transaction/TransactionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* Main content with top padding for fixed navbar */}
      <div className="pt-16 bg-[#0d1117] min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardContainer />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          {/* <Route path="/add-transaction" element={<AddTransactionPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
