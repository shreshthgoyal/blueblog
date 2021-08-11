import React from "react";
import { graphql } from "gatsby";

import Layout from '../components/layout';

export default ({ data }) => {
    const post = data.markdownRemark;

    return (
        <Layout>
            <div>
                <h1 style={{
            color: `hsla(0, 0%, 0%, 0.8)`,
            "line-height": `70pt`,
        }}>{post.frontmatter.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: post.html }} style={{
            "line-height": `26pt`,
        }}/>
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