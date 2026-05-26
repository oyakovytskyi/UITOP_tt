import { Container } from '@mui/material';
import { TodosPage } from './pages/TodosPage';

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <TodosPage />
    </Container>
  );
}

export default App;
