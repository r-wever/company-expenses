import { rows } from "../../constants/users";

export const updateUser = (id, field, value) => {
  const selectedUser = rows.get(id);
  const newUser = { ...selectedUser, [`${field}`]: value };
  rows.set(id, newUser);
};

export const createUser = (firstName, lastName) => {
  const key = rows.size + 1;
  rows.set(key, {
    id: key,
    firstName: firstName,
    fullName: firstName + " " + lastName,
    lastName: lastName,
    totalExpense: null,
  });
  return rows;
};

export const removeUser = (id) => {
  rows.delete(id);
  return rows;
};

export const removeExpense = (userId, expenseIndex) => {
  const selectedUser = rows.get(userId);
  const selectedUsersExpenses = selectedUser.expenses;

  selectedUsersExpenses.splice(expenseIndex, 1);
  let currentTotalExpenes = 0;
  if (selectedUsersExpenses.length > 0) {
    currentTotalExpenes = selectedUsersExpenses
      .map((expense) => expense.cost)
      .reduce((previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue);
      });
  }
  const newUser = {
    ...selectedUser,
    totalExpense: currentTotalExpenes,
    expenses: selectedUsersExpenses,
  };
  rows.set(userId, newUser);
  return rows;
};

export const createExpense = (userId, category, cost, description) => {
  const newExpense = { category, cost, description, cost };
  const selectedUser = rows.get(userId);
  const selectedUsersExpenses = selectedUser.expenses || [];
  selectedUsersExpenses.push(newExpense);
  let currentTotalExpenes = 0;
  if (selectedUsersExpenses.length > 0) {
    currentTotalExpenes = selectedUsersExpenses
      .map((expense) => expense.cost)
      .reduce((previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue);
      });
  }
  const newUser = {
    ...selectedUser,
    totalExpense: currentTotalExpenes,
    expenses: selectedUsersExpenses,
  };
  rows.set(userId, newUser);
  return rows;
};

export const editExpense = (
  userId,
  category,
  cost,
  description,
  expenseIndex
) => {
  const newExpense = { category, cost, description, cost };
  const selectedUser = rows.get(userId);
  const selectedUsersExpenses = selectedUser.expenses || [];
  selectedUsersExpenses[expenseIndex] = newExpense;
  let currentTotalExpenes = 0;
  if (selectedUsersExpenses.length > 0) {
    currentTotalExpenes = selectedUsersExpenses
      .map((expense) => expense.cost)
      .reduce((previousValue, currentValue) => {
        return Number(previousValue) + Number(currentValue);
      });
  }
  const newUser = {
    ...selectedUser,
    totalExpense: currentTotalExpenes,
    expenses: selectedUsersExpenses,
  };
  rows.set(userId, newUser);
  return rows;
};
