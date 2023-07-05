import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "..";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [userEmail, setUserEail] = useRecoilState(userEmailState);
  console.log("loadOnStart...");
  const navigate = useNavigate();

  if (sessionStorage.getItem("authToken"))
    setJwt(sessionStorage.getItem("authToken"));

  if (sessionStorage.getItem("authUserEmail"))
    setUserEail(sessionStorage.getItem("authUserEmail"));


  return (<nav className="navbar bg-body-tertiary fixed-top">
    <div className="container-fluid">
    <a className="navbar-brand" onClick={(evt) => navigate("/home")}>TWITTER</a>
      <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">TWITTER</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item">
               <Link className="nav-link" to="/home">home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Link</Link>
            </li>
            {!jwt && <li className="nav-item">
              <Link className="nav-link" to="/flow/login">로그인</Link>
            </li>}


            {jwt &&<li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/settings/profile">개인정보 수정</Link></li>
                <li><Link className="dropdown-item" to="/settings/deactivate">계정삭제</Link></li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>}
          </ul>
        </div>
      </div>
    </div>
  </nav>);
}

export default NavBar;