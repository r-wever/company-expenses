import React, { createContext, useState } from "react";
import "./App.css";
import { userTableData } from "./constants/users";
import AddEditExpensesForm from "./components/expenses/AddEditExpensesForm";
import AddUserForm from "./components/user/AddUserForm";
import CompanyExpensesGrid from "./components/company/CompanyExpensesGrid";
import ExpensesGrid from "./components/expenses/ExpensesGrid";
import UsersGrid from "./components/user/UsersGrid";

export const UserContext = createContext();

const App = () => {
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState(userTableData);
  return (
    <UserContext.Provider value={{ users, setUsers, editId, setEditId }}>
      <div className="App">
        <div className="py-6 px-9">
          <section className="flex flex-col mb-7 px-10 py-6">
            <div className="font-semibold mb-2 text-3xl text-white uppercase">
              Users
            </div>
            <div className="flex w-full">
              <UsersGrid />
              <AddUserForm />
            </div>
          </section>
          <section className="flex flex-col mb-7 px-10 py-6">
            <div className="font-semibold mb-2 text-3xl text-white uppercase">
              Expenses
            </div>
            <div className="flex w-full">
              <ExpensesGrid />
              <AddEditExpensesForm />
            </div>
          </section>
          <section className="flex flex-col mb-7 px-10 py-6">
            <div className="font-semibold mb-2 text-3xl text-white uppercase">
              Company Expenses
            </div>
            <div className="flex w-full">
              <CompanyExpensesGrid />
            </div>
          </section>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
