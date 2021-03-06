var React = require("react");

class Register extends React.Component {
  render() {
    return (
      <html>
        <head />
                <link rel={"stylesheet"} href={"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"} integrity={"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"} crossorigin={"anonymous"}></link>
        <body>
        <nav class={"navbar navbar-expand-lg navbar-light bg-light"}>

            <button class={"navbar-toggler"} type={"button"} data-toggle={"collapse"} data-target={"#navbarNavAltMarkup"} aria-controls={"navbarNavAltMarkup"} aria-expanded={"false"} aria-label={"Toggle navigation"}>
            <span class={"navbar-toggler-icon"}></span>
            </button>
            <div class={"collapse navbar-collapse"} id={"navbarNavAltMarkup"}>
                <div class="navbar-nav">
                    <a class={"nav-item nav-link active"} href={"/"}>Home <span class="sr-only">(current)</span></a>
                    <a class="nav-item nav-link" href="/artists">View Artists</a>
                    <a class="nav-item nav-link" href="/artists/new">Add Artist</a>
                    <a class="nav-item nav-link" href="/songs">View Songs</a>
                    <a class="nav-item nav-link" href="/songs/new">Add Artist</a>
                    <a class= "nav-item nav-link" href="/playlist"> View Play list </a>
                    <a class= "nav-item nav-link" href="/playlist/new"> Add New Play list </a>
                </div>
              </div>
        </nav>
          <h3>Register form Goes Here!</h3>
            <form method="POST" action="/register"  style={{textAlign: "Center"}}>
                <span>Enter Login Name: </span>
                    <input  id= "loginname" type="text" name="loginname" placeholder="Enter Login Name" required
                            oninvalid="this.setCustomValidity('Enter Valid Login Name Here')"
                            oninput="this.setCustomValidity('')" ></input>
                    <br></br><br></br>

                    <span>Enter Password: </span>
                    <input type="text" name="password" placeholder="Enter Strong Password" required
    oninvalid="this.setCustomValidity('Enter Password Here')"
    oninput="this.setCustomValidity('')"></input>

                    <br></br><br></br>
                    <input type="submit" value="Submit"></input>
                </form>
        </body>
      </html>
    );
  }
}

module.exports = Register;