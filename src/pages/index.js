import * as React from "react"
import { graphql, Link } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogLink = styled(Link)`
text-decoration: none;
`

const BlogTitle = styled.h3
  `
margin-bottom: 20px;
`

export default ({ data }) => (
  <Layout>
    <Seo title="Home" />
    <div style={{ background: `#fff`,
    "boxShadow": `0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)`,
    "borderRadius": `10px`,
border: `1px solid rgba( 255, 255, 255, 0.18 )`,
"minHeight": `590px`,
padding: `10px`,
}}>
    {
      data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <BlogLink to={node.fields.slug} >
            <BlogTitle style={{
              color: `hsla(0, 0%, 0%, 0.8)`,
              "lineHeight": `26pt`,
            }}>{node.frontmatter.title} - {node.frontmatter.date}</BlogTitle>
          </ BlogLink >
          <p style={{
            "lineHeight": `26pt`,
          }}>{node.excerpt}</p>
          <br />
        </div>
      ))
    }
    </div>
  </Layout >
)

export const query = graphql`
query {
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    totalCount
    edges {
      node {
        id
        frontmatter {
          title
          date
          description
        }
        fields {
          slug
        }
        excerpt
      }
    }
  }
}
`