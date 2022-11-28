import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createExpense, editExpense } from "../user/UserUtils";
import { useOutsideClick } from "../../hooks/customHooks";
import { UserContext } from "../../App";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PopUpPanel from "../PopUpPanel";

const AddEditExpensesForm = () => {
  const userContext = useContext(UserContext);
  const { users, setUsers, editId, setEditId } = userContext;
  const categoryButton = useRef();
  const costRef = useRef();
  const descriptionRef = useRef();
  const usersButton = useRef();

  const [categoryExpand, setCategoryExpand] = useState(false);
  const [costValue, setCostValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersExpand, setUsersExpand] = useState(false);

  useEffect(() => {
    if (!editId) return;
    const ids = editId.split("~");
    const userId = ids[0];
    const expenseIndex = ids[1];
    const expense = users.rows.get(Number(userId)).expenses[expenseIndex];
    setSelectedUser(users.rows.get(Number(userId)));
    setSelectedCategory(expense.category);
    setCostValue(expense.cost);
    descriptionRef.current.value = expense.description;
    usersButton.current.style.border = "1px solid rgb(0 0 0 / 0)";
    categoryButton.current.style.border = "1px solid rgb(0 0 0 / 0)";
    costRef.current.style.border = "1px solid rgb(209 213 219 / 1)";
    descriptionRef.current.style.border = "1px solid rgb(209 213 219 / 1)";
  }, [editId]);

  const categories = [
    { id: 0, title: "Food" },
    { id: 1, title: "Travel" },
    { id: 2, title: "Equipment" },
  ];

  const userData = useMemo(() => {
    const result = [];
    for (const [key, value] of users.rows) {
      result.push(value);
    }
    return result;
  }, [users.rows.size]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    !selectedUser
      ? (usersButton.current.style.border = "1px solid red")
      : (usersButton.current.style.border = "1px solid rgb(0 0 0 / 0)");
    !selectedCategory
      ? (categoryButton.current.style.border = "1px solid red")
      : (categoryButton.current.style.border = "1px solid rgb(0 0 0 / 0)");
    !costRef.current.value
      ? (costRef.current.style.border = "1px solid red")
      : (costRef.current.style.border = "1px solid rgb(209 213 219 / 1)");
    !descriptionRef.current.value
      ? (descriptionRef.current.style.border = "1px solid red")
      : (descriptionRef.current.style.border =
          "1px solid rgb(209 213 219 / 1)");
    if (
      !selectedUser ||
      !selectedCategory ||
      !costRef.current.value ||
      !descriptionRef.current.value
    )
      return;

    let editIdString = editId ? editId : "";
    const ids = editIdString.split("~");
    const expenseIndex = ids[1];
    const newUsers = editId
      ? editExpense(
          selectedUser.id,
          selectedCategory,
          costRef.current.value,
          descriptionRef.current.value,
          expenseIndex
        )
      : createExpense(
          selectedUser.id,
          selectedCategory,
          costRef.current.value,
          descriptionRef.current.value
        );
    setUsers((prevUsers) => ({ ...prevUsers, rows: newUsers }));
    clearValues();
    setEditId(null);
  };

  const clearValues = () => {
    setSelectedUser(null);
    setSelectedCategory(null);
    setCostValue("");
    costRef.current.value = null;
    descriptionRef.current.value = null;
  };

  const closeAll = useCallback(() => {
    setUsersExpand(false);
    setCategoryExpand(false);
  }, []);

  const handleUsersDropdown = useCallback(() => {
    closeAll();
    setUsersExpand(true);
  }, [closeAll]);

  const handleCategoryDropdown = useCallback(() => {
    closeAll();
    setCategoryExpand(true);
  }, [closeAll]);

  const ref = useOutsideClick(() => {
    closeAll();
  });

  const handleUserSelect = useCallback((e) => {
    const targetUser = users.rows.get(Number(e.target.id));
    setSelectedUser(targetUser);
    closeAll();
  }, []);

  const handleCategorySelect = useCallback((e) => {
    const targetCategory = categories[Number(e.target.id)];
    setSelectedCategory(targetCategory.title);
    closeAll();
  }, []);

  const adjustCost = (e) => {
    if (e.key === "Backspace") {
      setCostValue((prev) => {
        return prev.toString().slice(0, prev.length - 1);
      });
    }
  };

  const validateCostInput = (e) => {
    var key = e.key;
    var t = costValue + key;
    const checker =
      t.indexOf(".") >= 0
        ? t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)
        : t;
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      e.preventDefault();
    } else {
      setCostValue(checker);
    }
  };

  return (
    <div className="block p-6 rounded-2xl shadow-lg bg-white w-4/12 h-[333px]">
      <div className="font-semibold mb-3 text-lg">{`${
        editId ? "Edit Expense" : "Add Expenses"
      }`}</div>
      <div className="flex justify-between items-end mb-3">
        <div className="flex flex-col gap-4" ref={ref}>
          <div className="flex gap-6">
            <div className="z-20 relative w-[150px]">
              <button
                className="dropdown-toggle w-full px-4 py-1.5 bg-violet-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                type="button"
                id="dropdownMenuSmallButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleUsersDropdown}
                ref={usersButton}
              >
                Users
                <span className="ml-auto">
                  <ArrowDropDownIcon />
                </span>
              </button>
              {usersExpand && (
                <PopUpPanel>
                  <ul
                    className={`absolute h-[23rem] overflow-y-scroll min-w-max bg-white text-base float-left py-2 list-none text-left rounded-b-lg shadow-lg m-0 bg-clip-padding border-none`}
                  >
                    {userData &&
                      userData.map((user) => {
                        return (
                          <li
                            className="bg-white w-[150px] text-sm py-2 px-4 font-normal block whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                            id={user.id}
                            key={user.id}
                            onClick={handleUserSelect}
                          >
                            {user.fullName}
                          </li>
                        );
                      })}
                  </ul>
                </PopUpPanel>
              )}
            </div>
            {selectedUser && (
              <div className="mt-1">{selectedUser.fullName}</div>
            )}
          </div>
          <div className="flex gap-6">
            <div className="z-10 relative w-[150px]">
              <button
                className="dropdown-toggle w-full px-4 py-1.5 bg-violet-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                type="button"
                id="dropdownMenuSmallButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleCategoryDropdown}
                ref={categoryButton}
              >
                Category
                <span className="ml-auto">
                  <ArrowDropDownIcon />
                </span>
              </button>
              {categoryExpand && (
                <PopUpPanel>
                  <ul
                    className={`min-w-max absolute bg-white text-base float-left py-2 list-none text-left rounded-b-lg shadow-lg mt-0 m-0 bg-clip-padding border-none`}
                    aria-labelledby="dropdownMenuSmallButton"
                  >
                    {categories.map((catgory) => {
                      return (
                        <li
                          className="bg-white w-[150px] text-sm py-2 px-4 font-normal block whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                          id={catgory.id}
                          key={catgory.id}
                          onClick={handleCategorySelect}
                        >
                          {catgory.title}
                        </li>
                      );
                    })}
                  </ul>
                </PopUpPanel>
              )}
            </div>
            {selectedCategory && <div className="mt-1">{selectedCategory}</div>}
          </div>
        </div>
      </div>
      <div className="form-group flex mb-3">
        <label
          className="form-label flex flex-col mr-5 text-gray-700"
          htmlFor="costInput"
        >
          Cost
          <small className="inline text-xs text-violet-600">*Required</small>
        </label>

        <input
          className="form-control block w-32 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="costInput"
          placeholder="$$$ ?"
          step=".01"
          ref={costRef}
          value={costValue}
          onKeyUp={adjustCost}
          onKeyPress={validateCostInput}
          onChange={() => {}}
          type="text"
        />
      </div>
      <div className="form-group mb-3">
        <label
          htmlFor="descriptionInput"
          className="form-label w-full flex items-center mb-0 text-gray-700"
        >
          Description
          <small className="inline text-xs text-violet-600 ml-auto">
            *Required
          </small>
        </label>
        <textarea
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="descriptionInput"
          rows="3"
          placeholder="What was the nature of this expense?"
          ref={descriptionRef}
        ></textarea>
      </div>

      <div className="flex">
        <button
          onClick={handleAddExpense}
          type="submit"
          className="ml-auto px-6 py-2.5 bg-violet-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddEditExpensesForm;
