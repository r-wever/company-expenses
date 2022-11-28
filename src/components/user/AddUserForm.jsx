import React, { useContext, useRef } from "react";
import { createUser } from "./UserUtils";
import { UserContext } from "../../App";

const AddUserForm = () => {
  const userContext = useContext(UserContext);
  const { setUsers } = userContext;
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    !firstNameRef.current.value
      ? (firstNameRef.current.style.border = "1px solid red")
      : (firstNameRef.current.style.border = "1px solid rgb(209 213 219 / 1)");

    !lastNameRef.current.value
      ? (lastNameRef.current.style.border = "1px solid red")
      : (lastNameRef.current.style.border = "1px solid rgb(209 213 219 / 1)");

    if (!firstNameRef.current.value || !lastNameRef.current.value) return;

    const newUsers = createUser(
      firstNameRef.current.value,
      lastNameRef.current.value
    );
    setUsers((prevUsers) => ({ ...prevUsers, rows: newUsers }));
    firstNameRef.current.value = null;
    lastNameRef.current.value = null;
  };

  return (
    <div className="block p-6 rounded-2xl shadow-lg bg-white w-5/12 h-[333px]">
      <div className="font-semibold mb-3 text-lg">Create a new user</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label
            htmlFor="firstNameInput"
            className="form-label w-full flex items-center mb-0 text-gray-700"
          >
            First name
            <small className="inline text-xs text-violet-600 ml-auto">
              *Required
            </small>
          </label>
          <input
            aria-describedby="emailHelp"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="firstNameInput"
            placeholder="First name"
            ref={firstNameRef}
            type="text"
          />
        </div>
        <div className="form-group mb-8">
          <label
            className="form-label w-full flex items-center mb-0 text-gray-700"
            htmlFor="lastNameInput"
          >
            Last name
            <small className="inline text-xs text-violet-600 ml-auto">
              *Required
            </small>
          </label>
          <input
            aria-describedby="emailHelp"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="lastNameInput"
            placeholder="Last name"
            ref={lastNameRef}
            type="text"
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-violet-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
