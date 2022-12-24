import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <h1 className="display-1">
              <Link to="/">IQEngine</Link>
            </h1>
          </div>
          <div className="col-lg bs-component">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
              <div className="container-fluid">
                <Link to="#" className="navbar-brand">
                  Navbar
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor03">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <Link to="#" className="nav-link active">
                        Home
                        <span className="visually-hidden">(current)</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link">
                        Features
                      </Link>
                    </li>
                    <li className="nav-item dropdown">
                      <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to="#" role="button" aria-haspopup="true" aria-expanded="false">
                        Dropdown
                      </Link>
                      <div className="dropdown-menu">
                        <Link className="dropdown-item" to="#">
                          Action
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Another action
                        </Link>
                        <Link className="dropdown-item" to="#">
                          Something else here
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="#">
                          Separated link
                        </Link>
                      </div>
                    </li>
                  </ul>
                  <form className="d-flex">
                    <input className="form-control me-sm-2" type="text" placeholder="Search"></input>
                    <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
