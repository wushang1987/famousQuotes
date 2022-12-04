import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post, allMarkdownRemark },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const posts = allMarkdownRemark.nodes
  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          {/* <p>{post.frontmatter.date}</p> */}
          {/* <StaticImage
            src={post.frontmatter.authImg}
            width={"12px"}
            height={"12px"}
            alt={post.frontmatter.auth}
          /> */}
          {/* <GatsbyImage
            image={post.frontmatter.authImg}
            alt={post.frontmatter.auth}
          /> */}
          {/* <p>{post.frontmatter.auth}</p> */}
          {/* <p>{post.frontmatter.authImg}</p> */}
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <div>
          <p>相关</p>

          <ol style={{ listStyle: `none` }}>
            {posts.map(item => {
              console.log(item.frontmatter.auth)
              console.log(post.frontmatter.auth)
              if (item.frontmatter.auth !== post.frontmatter.title) {
                return null
              }
              const title = item.frontmatter.title || item.fields.slug

              return (
                <li key={item.fields.slug}>
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <Link to={item.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
        <footer>{/* <Bio /> */}</footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $auth: String
    $previousPostId: String
    $nextPostId: String
  ) {
    allFile {
      edges {
        node {
          childImageSharp {
            id
            gatsbyImageData
          }
        }
      }
    }

    site {
      siteMetadata {
        title
      }
    }

    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tag: { eq: "motto" }, auth: { eq: $auth } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          auth
          from
          fromPage
          authPage
        }
      }
    }

    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html

      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        auth
      }
    }

    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
