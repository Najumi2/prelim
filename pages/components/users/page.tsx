// users/page.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Grid, Paper, Avatar } from '@mui/material';

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
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
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Link href={`/components/users/${user.id}`} passHref>
                <Paper
                  style={{
                    padding: 20,
                    cursor: 'pointer',
                    color: 'inherit' // Inherit color
                  }}
                >
                  <Avatar sx={{ bgcolor: '#f0f0f0', color: '#333', marginRight: 1 }}>{user.name.charAt(0)}</Avatar>
                  <div>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{user.email}</Typography> {/* Display email */}
                  </div>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Users;
