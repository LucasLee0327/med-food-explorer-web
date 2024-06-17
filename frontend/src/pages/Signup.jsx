import { useState, useEffect } from "react";
import services from "../services";

// you should design your register page and api
function SignUpPage() {
  const [account, setAccount] = useState({ username: "", password: ""});
  const [errorMessage, setErrorMessage] = useState("");
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^[a-zA-Z0-9]+$/;

  /** @type {React.ChangeEventHandler<HTMLInputElement>} */
  const handleTextInputChange = ({ target: { name, value } }) => {
    // const { name, value } = event.target
    // obj = { ...prev }; obj[name] = value
    setAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** @type {React.FormEventHandler<HTMLFormElement>} */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!usernameRegex.test(account.username)) {
      setErrorMessage("Username can only contain letters and numbers.");
      setAccount({ username: "", password: "" });
      return;
    }
    if (!passwordRegex.test(account.password)) {
      setErrorMessage("Password can only contain letters and numbers.");
      setAccount({ username: "", password: "" });
      return;
    }
    services.user.createOne({ username: account.username, password: account.password })
      .then((data) => {
        alert("Account created!");
      })
      .catch((error) => {
        alert("Account creation failed: " + error.response.data.message);
      });
    setAccount({ username: "", password: "" });
  };

  return (
    <>
      <div className="flex justify-center">
        {errorMessage && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  pattern="[a-zA-Z0-9]+"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Username (A~Z, a~z, 0~9 only)"
                  value={account.username}
                  onChange={handleTextInputChange}
                />
                <label htmlFor="username" className="sr-only">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  pattern="[a-zA-Z0-9]+"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password (A~Z, a~z, 0~9 only)"
                  value={account.password}
                  onChange={handleTextInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
