import { NavLink } from "react-router-dom";

export default function Navbar() {
  const activeClass = "text-blue-600 border-b-2 border-blue-600 font-semibold";
  const normalClass = "text-gray-700 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex space-x-6 sticky top-0 z-50">
      <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : normalClass)} end>
        Dashboard Summary
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
        Transactions
      </NavLink>
      <NavLink to="/add-transaction" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
        Add Transaction
      </NavLink>
      <NavLink to="/monthly-chart" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
        Monthly Chart
      </NavLink>
      <NavLink to="/category-chart" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
        Category Chart
      </NavLink>
    </nav>
  );
}

