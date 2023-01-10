import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  console.log("params in getServerSideProps");
  console.log(params)

  return {
    props: {      
    },
  };
}

function BlogPostsPage() {
  // load this page by going to /blog/any/path/you/want
  // like /blog/2020/12
  // this is a catch-all route
  const router = useRouter();
  console.log(router.query);

  return (
    <div>      
      <h1>The Blog Posts</h1>
    </div>
  );
}

export default BlogPostsPage;