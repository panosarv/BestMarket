 import "../styles/Account.css"
 import {useState} from "react"
 
 function Account(props) {
    let [authMode, setAuthMode] = useState("signin")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")  

    const changeAuthMode = () => {
      setAuthMode(authMode === "signin" ? "signup" : "signin")
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
                  <span className="link-primary" onClick={changeAuthMode}>
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
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign In
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
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Password"
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
  
export default Account