import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Sidebar from "./sidebar/sidebar"
import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <div
        className="blog"
      >
        <Sidebar />

        <div style={{
          margin: `0 auto`,
          maxWidth: 980,
          padding: `0 1.0875rem 1.45rem`,
          paddingRight: `2em`,
          marginTop: `55px`,
          marginLeft: `50px`,
        }}
        >
          <main>{children}</main>
      </div>
    </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
