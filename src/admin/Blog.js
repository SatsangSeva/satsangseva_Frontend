import { useNavigate } from 'react-router-dom';
import '../Csss/Blog.css';
import { Table } from 'react-bootstrap';
import Delete from '@mui/icons-material/DeleteForeverTwoTone';
import View from '@mui/icons-material/VisibilityTwoTone';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = () => {
  const url = process.env.REACT_APP_BACKEND; // Backend URL from environment variables
  const navigate = useNavigate();

  // State variables
  const [blogs, setBlogs] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch blog data from API when the component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${url}/admin/blog`);
        setBlogs(response.data.blogs); // Assuming the response has a "blogs" array
      } catch (error) {
        console.error('Error fetching blog data:', error);
        alert('Failed to fetch blogs. Please try again.');
      }
    };

    fetchBlogs();
  }, [url]);

  // Handle navigation to create a new blog
  const handleCreateBlog = () => {
    navigate('/admin/createblog');
  };

  // View blog details
  const handleViewBlog = (id) => {
    navigate(`/blog?q=${id}`);
  };

  // Confirm blog deletion
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${url}/admin/blog/${currentBlogId}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== currentBlogId));
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    } finally {
      setLoading(false);
      setCurrentBlogId(null);
      setShowDeleteDialog(false);
    }
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCurrentBlogId(null);
  };

  return (
    <div className="container gap-3">
      <div className="blog-container">
        <h1 className="text-tomato fw-bold">Blogs</h1>
        <button className="btn btn-outline-primary" onClick={handleCreateBlog}>
          Create A New Blog
        </button>
      </div>

      <div className="table-container border">
        <Table bordered hover className="m-0">
          <thead className="sticky-top">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog._id}</td>
                  <td>
                    {blog.title.length > 35
                      ? `${blog.title.substring(0, 35)}...`
                      : blog.title}
                  </td>
                  <td>
                    {blog.content.length > 70
                      ? `${blog.content.substring(0, 70)}...`
                      : blog.content}
                  </td>
                  <td>
                    <View
                      onClick={() => handleViewBlog(blog._id)}
                      titleAccess="View Blog"
                      className="cursor-pointer"
                      style={{ color: '#D26600' }}
                    />
                  </td>
                  <td>
                    <Delete
                      titleAccess="Delete Blog"
                      className="cursor-pointer"
                      style={{ color: '#D26600' }}
                      onClick={() => {
                        setCurrentBlogId(blog._id);
                        setShowDeleteDialog(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal for delete confirmation */}
      {showDeleteDialog && (
        <div className="modal show" style={{ display: 'block', marginTop: '50px' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to DELETE this blog? <br />
                  This action is irreversible.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'DELETE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
