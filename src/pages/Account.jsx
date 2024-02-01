 import "../styles/Account.css"
 import {useState} from "react"
 
 function Account(props) {
    let [authMode, setAuthMode] = useState("signin")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")  
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("")
    const [emailClassName,setEmailClassName]=useState("input-checker-true")
    const [emailErrorMessage,setEmailErrorMessage]=useState("")
    const [usernameErrorMessage,setUsernameErrorMessage]=useState("")
    const [passwordClassName,setPasswordClassName]=useState("input-checker-true")
    const [usernameClassName,setUsernameClassName]=useState("input-checker-true")
    const [hasError, setHasError] = useState(true)

    const changeAuthMode = () => {
      setAuthMode(authMode === "signin" ? "signup" : "signin")
    }

    const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      if (!(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value))) {
        setPasswordClassName("input-checker-false");
        setPasswordErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      } else {
        setPasswordClassName("input-checker-true");
        setPasswordErrorMessage('');
      }
    };

    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      if (!(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value))) {
        setEmailClassName("input-checker-false");
        setEmailErrorMessage('Invalid email address.'); 
      }
      else {
        setEmailClassName("input-checker-true");
        setEmailErrorMessage('');
      }
    }
    const handleUsernameChange = (e) => {
      const value = e.target.value;
      setUsername(value);
      if (!(/^[a-zA-Z\d]{5,}$/.test(value))) {
        setUsernameClassName("input-checker-false");
        setUsernameErrorMessage('Username must be at least 5 characters long and contain only letters and numbers.');
      } else {
        setUsernameClassName("input-checker-true");
        setUsernameErrorMessage('');
      }
    }

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      console.log("here:",JSON.stringify({ username, password, email }))
      try {
          const response = await fetch(`http://localhost:3000/api/auth/${authMode}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${localStorage.getItem('accessToken')}`,
              },
              body: JSON.stringify({ username, password, email }),
          });
          const data = await response.json();
          localStorage.setItem('accessToken',data.accessToken);
          console.log("data:",data)
          setMessage(data.message);
      } catch (error) {
          console.log(error);
          setMessage('An error occurred. Please try again.');
      }
  };
    if (authMode === "signin") {
        return (
          <div className="Auth-form-container">
            <div className="bg-container">
            <img src="./bg-account-2.jpg" className="login-img" alt="login-img" />
            <form className="Auth-form" onSubmit={handleFormSubmit}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="text-center">
                  Not registered yet?{" "}
                  <span className="link-primary change-cursor" onClick={changeAuthMode}>
                    Sign Up
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="e.g Jane Doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  {message && <p className="text-danger">{message}</p>}  
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
                <p className="text-center mt-2">
                  Forgot <a href="#">password?</a>
                </p>
              </div>
            </form>
            </div>
          </div>
        )
      }
    
      return (
        <div className="Auth-form-container">
        <div className="bg-container">
        <img src="./bg-account-2.jpg" className="login-img" alt="login-img" />
          <form className="Auth-form" onSubmit={handleFormSubmit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="text-center">
                Already registered?{" "}
                <span className="link-primary change-cursor" onClick={changeAuthMode}>
                  Sign In
                </span>
              </div>
              <div className="form-group mt-3">
                <label>Username</label>
                <input
                  type="text"
                  className={`form-control mt-1 ${usernameClassName}`}
                  placeholder="e.g Jane Doe"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                  {usernameErrorMessage && <p className="text-danger error-message">{usernameErrorMessage}</p>}  
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                  {emailErrorMessage && <p className="text-danger error-message">{emailErrorMessage}</p>}  
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className={`form-control mt-1 ${passwordClassName}`}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}

                />
              </div>
              <div className="d-grid gap-2 mt-3">
                  {passwordErrorMessage && <p className="text-danger error-message">{passwordErrorMessage}</p>}  
              </div>
              <div className="d-grid gap-2 mt-3">
                  {message && <p className="text-danger error-message">{message}</p>}  
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <p className="text-center mt-2">
                Forgot <a href="#">password?</a>
              </p>
            </div>
          </form>
          </div>
        </div>
      )
    }
  
export default Account