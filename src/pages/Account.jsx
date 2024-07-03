 import "../styles/Account.css"
 import {useState} from "react"
 import {useNavigate} from "react-router-dom"
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
    const navigateTo = useNavigate();
    const changeAuthMode = () => {
      setMessage("");
      setEmail('');
      setUsername('');
      setPassword('');
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
      try {
        // Registration logic
        if (authMode === "signup") {
          const response = await fetch(`https://bestmarket-server.onrender.com/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
          });
  
          
          
          const data = await response.json();
          setMessage(data.message);
  
          // Automatically sign in the user after successful registration
          await signInUser(username, password);
        } else {
          // Sign-in logic
          const response = await fetch(`https://bestmarket-server.onrender.com/api/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
  
          
          
          
          if(response.ok){
            const data = await response.json();
            localStorage.setItem('accesstoken', data.accesstoken);
            setMessage(data.message);
  
            // Redirect to the profile page after successful sign in
            navigateTo('/profile');
          }  
          else{
            setMessage("Invalid username or password")
          }
        }

      } catch (error) {
        console.log(error);
        setMessage('An error occurred. Please try again.');
      }
   };
   const signInUser = async (username, password) => {
    try {
      const response = await fetch(`https://bestmarket-server.onrender.com/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      

      const data = await response.json();
      localStorage.setItem('accesstoken', data.accesstoken);
      setMessage(data.message);

      // Redirect to the profile page after successful sign in
      navigateTo('/profile');
    } catch (error) {
      console.log(error);
      setMessage('An error occurred during sign in. Please try again.');
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
              
            </div>
          </form>
          </div>
        </div>
      )
    }
  
export default Account