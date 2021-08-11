import * as React from "react"
import { Link } from "gatsby"
import "./sidebar.css"
import { StaticImage } from "gatsby-plugin-image"

import { FaFacebook } from "react-icons/fa";

const Sidebar = () => (
   <div className="container">
  <div className="card">
    <div className="pic-container">
     <StaticImage src="../../images/Shreshth.png" className="pic"/>
    </div>
    <div className="name">
      <span>Hi 👋</span>
      <br />
      <span>I'm Shreshth</span>
    </div>
    <div className="description">
      <p>This is my space where I pen down my thoughts, my experiences and compile my ideas. ✍</p>
    </div>
    <div className="title">
      <span>"Either write something worth reading or do something worth writing."</span>
    </div>
    <div className="message">
      <a href="https://m.me/codingandstuff/">Message</a>
    </div>
    <div className="links">
      <a href="https://www.facebook.com/codingandstuff/" target="_blank" className="fb">
	  <FaFacebook className="social-icon" />
      </a>
      <a href="https://www.youtube.com/channel/UCZvsBQB7yXx-jDPNCPrVCoQ" target="_blank" className="yt">
	  <FaFacebook className="social-icon" />
      </a>
      <a href="https://codepen.io/codingandstuff" target="_blank" className="cp">
	  <FaFacebook className="social-icon" />
      </a>
      <a href="https://coding-and-stuff.blogspot.com/" target="_blank" className="bg">
	  <FaFacebook className="social-icon" />
      </a>
    </div>
  </div>
</div>
  )
  
  export default Sidebar
  