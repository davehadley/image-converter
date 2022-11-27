import { Link } from "react-router-dom";

function Header() {
  return (
    <Link to="/">
      <div className="header">
        <div className="headerInner">
          <img
            src="./icon.svg"
            alt="Free Image Converter"
            className="AppIcon"
          ></img>
          <div className="headerTitleText">
            <h1>Free</h1>
            <h1>Image</h1>
            <h1>Converter</h1>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Header;
