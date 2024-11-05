import React from "react";

const CreatePost = () => {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <h2 className="font-semibold text-3xl">Create Post</h2>
      <form className="flex flex-col items-start space-y-2">
        <input
          type="text"
          name="title"
          id="Title"
          className="outline-none border border-gray-500 rounded px-2 py-1 w-1/2"
        />
        <input
          type="submit"
          value="Sumbit"
          className="py-1 px-4 rounded bg-sky-600 text-white cursor-pointer hover:bg-sky-700"
        />
      </form>
    </div>
  );
};

export default CreatePost;
