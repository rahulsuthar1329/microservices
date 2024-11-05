import React, { useEffect, useState } from "react";
import axios from "axios";

interface CommentType {
  id: string;
  content: string;
  status: string;
}

interface SinglePostType {
  title: string;
  comments: CommentType[];
}

interface PostType {
  [commentId: string]: SinglePostType;
}

function App() {
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState<PostType>({});

  const createPost = async (e) => {
    e.preventDefault();
    if (!title) return alert("title cannot be empty!");
    try {
      await axios.post("http://localhost:4000/posts", { title });
      await getPosts();
      setTitle("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPosts = async () => {
    try {
      const post = await axios.get<PostType>("http://localhost:4002/posts");
      setPosts(post.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const postComment = async (id: string) => {
    if (!comment) return alert("comment cannot be empty!");
    try {
      await axios.post(`http://localhost:4001/posts/${id}/comments`, {
        id,
        content: comment,
      });
      getPosts();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    postId: string
  ) => {
    if (e.key === "Enter") {
      postComment(postId);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-col p-4 space-y-4">
          <h2 className="font-semibold text-3xl">Create Post</h2>
          <form
            className="flex flex-col items-start space-y-2"
            onSubmit={createPost}
          >
            <input
              type="text"
              name="title"
              id="Title"
              value={title}
              className="outline-none border border-gray-500 rounded px-2 py-1 w-1/2"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="submit"
              value="Sumbit"
              className="py-1 px-4 rounded bg-sky-600 text-white cursor-pointer hover:bg-sky-700"
            />
          </form>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <h2 className="font-semibold text-3xl">Posts</h2>
          <div className="grid grid-cols-4 gap-x-2">
            {Object.keys(posts).map((id: string) => {
              const post = posts[id];
              return (
                <div className="border p-2" key={id}>
                  <h3 className="font-medium text-lg">{post.title}</h3>
                  <h4 className="">Comments:</h4>
                  <div className="px-3">
                    {post.comments?.length
                      ? post.comments.map((cmt: CommentType) => {
                          switch (cmt.status) {
                            case "pending":
                              return (
                                <p key={cmt.id}>
                                  This comment is awaiting moderation.
                                </p>
                              );
                            case "approved":
                              return <p key={cmt.id}>{cmt.content}</p>;
                            case "rejected":
                              return (
                                <p key={cmt.id}>This comment is rejected.</p>
                              );
                            default:
                              break;
                          }
                        })
                      : null}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      name="comment"
                      id="comment"
                      className="border px-2 outline-none"
                      placeholder="Enter comment"
                      onKeyDown={(e) => handleKeyPress(e, id)}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="bg-sky-600 text-white px-2"
                      onClick={(e) => postComment(id)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
