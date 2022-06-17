import Link from "next/link";

const baseUrl = "http://localhost/headless-wp/graphql";

const Post = ({ post }) => {
  const { title, content } = post;
  return (
    <div>
      <h1>{title}</h1>
      <p dangerouslySetInnerHTML={{ __html: content }}></p>
      <Link href="/">Home</Link>
    </div>
  );
};

export default Post;

export async function getStaticProps(ctx) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      variables: {
        id: ctx.params.slug,
        idType: "SLUG",
      },
      query: `
      query SinglePost($id:ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
          id
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
          slug
          title
        }
      }
        `,
    }),
  });

  const data = await res.json();
  return {
    props: {
      post: data.data.post,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
            query GetAllPostsQuery {
                posts {
                  nodes {
                    content
                    featuredImage {
                      node {
                        sourceUrl
                      }
                    }
                    slug
                    title
                  }
                }
              }
            `,
    }),
  });
  const data = await res.json();
  const posts = data.data.posts.nodes;

  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  console.log(paths);

  return {
    paths,
    fallback: false,
  };
}
