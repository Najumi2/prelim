import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, Typography, Grid, Paper, Modal, Box, Divider, IconButton } from '@mui/material';
import { Close, AccountCircle } from '@mui/icons-material';

const Post: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };  
  
  const handlePostClick = (post) => {
    setSelectedPost(post);
    if (post && post.id) {
      fetchComments(post.id);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'gray' }}>
            GROUP1
          </Typography>
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Link href="/" passHref>
                <Button color="inherit" style={{ color: 'white' }}>Dashboard</Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/components/users/page" passHref>
                <Button color="inherit" style={{ color: 'white' }}>User</Button>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/components/posts/page" passHref>
                <Button color="inherit" style={{ color: 'white' }}>Post</Button>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 80, padding: 20 }}>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Paper elevation={3} style={{ padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => handlePostClick(post)}>
                <AccountCircle sx={{ color: '#333', marginRight: 1, fontSize: 40 }} /> {/* Profile picture icon for post */}
                <div>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography color="textSecondary">{post.body}</Typography>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxHeight: '90%', overflowY: 'auto', width: '80%', maxWidth: '800px' }}>
          <Typography variant="h5" component="h2" gutterBottom>{selectedPost?.title}</Typography>
          <Typography color="textSecondary">{selectedPost?.body}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6" gutterBottom>Comments:</Typography>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
              <AccountCircle sx={{ color: '#333', marginRight: 1, fontSize: 40 }} /> {/* Profile picture icon for comment */}
              <Box>
                <Typography variant="subtitle1" color="primary">{comment.name}</Typography>
                <Typography color="textSecondary">{comment.body}</Typography>
              </Box>
            </Box>
          ))}
          <IconButton aria-label="close" onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Close />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
};

export default Post;
