import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Person, Description, Comment, Assignment } from '@mui/icons-material';
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StatCard = ({ title, total, icon }: { title: string, total: number, icon: React.ElementType }) => (
  <Card sx={{ backgroundColor: '#f0f0f0', color: '#666666', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
    <div>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography color="textSecondary">
        Total: {total}
      </Typography>
    </div>
    {icon && React.createElement(icon, { style: { fontSize: 40, marginLeft: 'auto' } })}
  </Card>
);


const LoadingIndicator = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress />
  </div>
);

const Home: React.FC = () => {
  const [statistics, setStatistics] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    todos: 0,
    loading: true,
  });
  const [todosPerUser, setTodosPerUser] = useState([]);
  const [loadingTodosPerUser, setLoadingTodosPerUser] = useState(true);

  useEffect(() => {
    fetchData();
    fetchTodosPerUser();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, postsResponse, commentsResponse, todosResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/comments'),
        fetch('https://jsonplaceholder.typicode.com/todos')
      ]);

      const [users, posts, comments, todos] = await Promise.all([
        usersResponse.json(),
        postsResponse.json(),
        commentsResponse.json(),
        todosResponse.json()
      ]);

      setStatistics({
        users: users.length,
        posts: posts.length,
        comments: comments.length,
        todos: todos.length,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatistics(prevState => ({ ...prevState, loading: false }));
    }
  };

const fetchTodosPerUser = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const todos = await response.json();
  
    const todosByUser = todos.reduce((acc: { [key: string]: number }, todo: { userId: string }) => {
      if (acc[todo.userId]) {
        acc[todo.userId]++;
      } else {
        acc[todo.userId] = 1;
      }
      return acc;
    }, {});
  
    setTodosPerUser(todosByUser);
    setLoadingTodosPerUser(false);
  } catch (error) {
    console.error('Error fetching todos per user:', error);
    setLoadingTodosPerUser(false);
  }
};

  

  const { users, posts, comments, todos, loading } = statistics;

  const chartData = {
    options: {
      labels: ['Users', 'Posts', 'Comments', 'Todos'],
      chart: {
        type: 'bar' as const, // Specify type as 'bar'
        height: 350,
        background: '#f0f0f0'
      },
      // other chart options...np
    },
    series: [{
      name: 'Count',
      data: [users, posts, comments, todos]
    }]
  };
   
  const todosPerUserChartData = {
    options: {
      labels: Object.keys(todosPerUser),
      chart: {
        type: 'bar' as const,
        height: 350,
        background: '#f0f0f0'
      },
      // other chart options...
    },
    series: [{
      name: 'Count',
      data: Object.values(todosPerUser)
    }]
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
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Users" total={users} icon={Person} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Posts" total={posts} icon={Description} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Comments" total={comments} icon={Comment} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Todos" total={todos} icon={Assignment} />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#f0f0f0', color: '#666666' }}>
                <CardContent>
                  <DynamicChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#f0f0f0', color: '#666666' }}>
                <CardContent>
                  {loadingTodosPerUser ? (
                    <LoadingIndicator />
                  ) : (
                    <DynamicChart
                      options={todosPerUserChartData.options}
                      series={todosPerUserChartData.series}
                      type="bar"
                      height={350}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default Home;
