import React, {useState, useRef, useEffect} from "react";
import Post from "./Post"


const Feed = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const observerRef = useRef(null)
  
  //fetch function defination which will be triggered by intersection observer
  const fetchPosts = async (page) => {
    setLoading(true)
    try{
      const response = await fetch(`/posts.json`)
      const usersResponse = await fetch('/users.json')

      const newPosts = await response.json()
      const usersData = await usersResponse.json()

      setUsers(usersData)

      console.log(newPosts)
      setPosts((prevPosts) => [...prevPosts, ...newPosts])
    }
    catch(error){
      console.error("Error fetching posts:", error)
    }
    finally{
      setLoading(false)
    }
  }

  //intersection observer to check when to fetch more posts
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1); // Increment page to fetch next
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 } // Adjust threshold as needed
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  useEffect(() => {
    fetchPosts(page)
  }, [page]) 

  //basic post fetching fucntion defination
  useEffect(() => {
    // Fetch both JSON files
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("/users.json");
        const postsResponse = await fetch("/posts.json");

        const usersData = await usersResponse.json();
        const postsData = await postsResponse.json();

        setUsers(usersData); // Store users
        
        setPosts(postsData); // Store posts
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Merge Posts with User Info
  const enrichedPosts = posts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    return { ...post, user };
  });

  return (
    <div className="max-w-md mx-auto mt-4">
      {/* User Info */}

      {/* Posts */}
      {enrichedPosts.map((post) => (
        <Post key={post.id} username={post.user.username} content={post.content} likes={post.likes} createdAt={post.createdAt} image={post.user.image} />
      ))}
    </div>
  );
};

export default Feed;
