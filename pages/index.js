import Link from "next/link";

export default function Home({ posts }) {
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {posts.nodes.map((post) => {
          return (
            <div key={post.slug}>
              <li>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost/headless-wp/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query GetAllPostsAndPages {
        pages {
          nodes {
            link
            slug
            title
          }
        }
        posts {
          nodes {
            slug
            title
          }
        }
      }   
      `,
    }),
  });

  const data = await res.json();
  return {
    props: {
      posts: data.data.posts,
    },
  };
}
