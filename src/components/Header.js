import React from "react";
import "./Header.css";


const Header = () => (
  <header className="documentation">
    <div className="ui container">
      <div className="menu">
        <div>
          <h1 className="ui header">
            <a href="">
              <img className="mapequation-logo"
                   src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
                   alt="mapequation-icon"/>
            </a>
            <div className="content">
                            <span className="brand">
                                <span className="brand-infomap">Infomap</span> <span className="brand-nn">Network Graph</span>
                            </span>
              <div className="sub header">Interactive hierarchical network navigator</div>
            </div>
          </h1>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
