import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import base_url from "../../config";
const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the blog details when the component mounts
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`${base_url}/api/blogs/${id}`);
        setBlog(response.data.blogPost); // Set blog data in state
      } catch (error) {
        setError("Failed to fetch the blog details."); // Set error state if the request fails
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchBlogDetails();
  }, [id]); // Dependency array includes `id` so it refetches when the `id` changes

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto my-4 p-4">
      <h1 className="text-3xl font-bold">{blog?.title || "Untitled Blog"}</h1>
      <p className="text-sm text-gray-500">
        {blog?.publishedDate
          ? new Date(blog.publishedDate).toLocaleString()
          : "Unknown Date"}
      </p>
      <div className="mt-4 flex justify-between items-start gap-4">
        {/* Category Section */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">Category</h3>
          <p>{blog?.category || "Uncategorized"}</p>
        </div>

        {/* Tags Section */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">Tags</h3>
          <ul className="flex flex-wrap gap-2">
            {blog?.tags?.length > 0
              ? blog.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag.replace(/"/g, "")} {/* Remove quotes from tags */}
                  </li>
                ))
              : "No Tags Available"}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <img
          src={`${base_url}${blog?.image || "/default-image.jpg"}`}
          alt={blog?.title || "Default Image"}
          className="w-full h-auto object-cover rounded-lg mb-4"
        />
      </div>
      {/* Render the content as HTML */}
      <div
        className="text-lg"
        dangerouslySetInnerHTML={{
          __html: blog?.content || "<p>No content available</p>",
        }}
      ></div>
    </div>
  );
};

export default BlogDetail;
