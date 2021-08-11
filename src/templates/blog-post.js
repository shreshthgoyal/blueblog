import React from "react";
import { Link, graphql } from "gatsby";

import Layout from '../components/layout';
import { FaHome } from "react-icons/fa";

export default ({ data }) => {
    const post = data.markdownRemark;

    return (
        <Layout>
            <div style={{ background: `#fff`,
    "boxShadow": `0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)`,
    "borderRadius": `10px`,
border: `1px solid rgba( 255, 255, 255, 0.18 )`,
"minHeight": `590px`,
padding: `10px`,
}}>
                <h1 style={{
            color: `hsla(0, 0%, 0%, 0.8)`,
            "lineHeight": `70pt`,
        }} >{post.frontmatter.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }} style={{
            "lineHeight": `26pt`,
        }}/>
        <br />
        <p style={{ textDecoration: `none`, fontSize: `.8em`}}><Link to="/"> Other Blogs </Link></p>
            </div>
        </Layout>
    )
}

export const query = graphql`
query($slug: String!)
{markdownRemark(fields: {slug: {eq: $slug}}){
    html
    frontmatter{
        title
    }
}
}
`