import { Link } from "react-router-dom";

function NavBar() {

    return (
      <>
        <div class="container">
          <div class="row">
            <div class="col-sm">
            <h1 className="display-1">IQEngine</h1>
            </div>
            <div class="col-lg bs-component">
              
              <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                  <Link to="#" class="navbar-brand">Navbar</Link>
                  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>

                  <div class="collapse navbar-collapse" id="navbarColor03">
                    <ul class="navbar-nav me-auto">
                      <li class="nav-item">
                        <Link to="#" class="nav-link active">Home
                          <span class="visually-hidden">(current)</span>
                        </Link>
                      </li>
                      <li class="nav-item">
                        <Link to="#" class="nav-link">Features</Link>
                      </li>
                      <li class="nav-item dropdown">
                        <Link class="nav-link dropdown-toggle" data-bs-toggle="dropdown" to="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</Link>
                        <div class="dropdown-menu">
                          <Link class="dropdown-item" to="#">Action</Link>
                          <Link class="dropdown-item" to="#">Another action</Link>
                          <Link class="dropdown-item" to="#">Something else here</Link>
                          <div class="dropdown-divider"></div>
                          <Link class="dropdown-item" to="#">Separated link</Link>
                        </div>
                      </li>
                    </ul>
                    <form class="d-flex">
                      <input class="form-control me-sm-2" type="text" placeholder="Search"></input>
                      <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                    </form>
                  </div>
                </div>
              </nav>
              

            </div>

            </div>
          </div>

      </>
    )
}

export default NavBar;