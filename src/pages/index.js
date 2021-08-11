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
    <div>
      {
        data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <BlogLink to={node.fields.slug} >
            <BlogTitle style={{
            color: `hsla(0, 0%, 0%, 0.8)`,
            "line-height": `26pt`,
        }}>{node.frontmatter.title} - {node.frontmatter.date}</BlogTitle>
            </ BlogLink >
            <p style={{
            "line-height": `26pt`,
        }}>{node.excerpt}</p>
        <br />
          </div>
        ))
      }
    </div>
  </Layout>
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