import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Button, Typography, Grid, Paper } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  // Add other properties as needed
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  // Add other properties as needed
}

const UserDetails: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]); // Provide type annotation for todos state

  useEffect(() => {
    if (userId) {
      const userIdString = Array.isArray(userId) ? userId[0] : userId;
      fetchUser(userIdString);
      fetchTodos(userIdString);
    }
  }, [userId]);

  const fetchUser = async (userId: string) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const fetchTodos = async (userId: string) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'gray' }}>
            GROUP1
          </Typography>
          <Link href="/components/users/page" passHref>
            <Button color="inherit" style={{ color: 'white' }}>Back to Users</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: 80, padding: 20 }}>
        <Typography variant="h4" gutterBottom style={{ color: 'white' }}>{user ? <span style={{ color: 'white' }}>{user.name} - {user.email}</span> : '...'}</Typography>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>Todos:</Typography>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <Typography>{todo.title} - {todo.completed ? 'Complete' : 'Incomplete'}</Typography>
              </li>
            ))}
          </ul>
        </Paper>
      </div>
    </div>
  );
};

export default UserDetails;
