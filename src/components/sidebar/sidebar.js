import * as React from "react"
import { Link } from "gatsby"
import "./sidebar.css"
import { StaticImage } from "gatsby-plugin-image"

import { FaLink } from "react-icons/fa";

const Sidebar = () => (
   <div className="container">
  <div className="card">
    <div className="pic-container">
     <StaticImage src="../../images/Shreshth.png" className="pic" alt="ProfilePic"/>
    </div>
    <div className="name">
      <span>Hi 👋</span>
      <br />
      <span>I'm Shreshth</span>
    </div>
    <div className="description">
      <p>This is my space where I pen down my thoughts, my experiences and compile my ideas. ✍</p>
    </div>
    <div className="description">
      <p>Get to know about me through</p>
      <a href="https://bluefolio.netlify.app/">Portfolio <FaLink /></a>
      <br />
      <p>or</p>
      <a href="https://linktr.ee/shreshth3">LinkTree <FaLink /></a>
    </div>
    <div className="title">
      <span>"Either write something worth reading or do something worth writing."</span>
    </div>
  </div>
</div>
  )
  
  export default Sidebar
  