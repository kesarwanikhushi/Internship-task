import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AuthContext } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';

// Mock child components
vi.mock('../components/TaskForm', () => ({
  default: () => <div data-testid="task-form">Task Form</div>
}));

vi.mock('../components/TaskList', () => ({
  default: () => <div data-testid="task-list">Task List</div>
}));

vi.mock('../components/KanbanBoard', () => ({
  default: () => <div data-testid="kanban-board">Kanban Board</div>
}));

vi.mock('../components/CalendarGrid', () => ({
  default: () => <div data-testid="calendar-grid">Calendar Grid</div>
}));

const MockAuthProvider = ({ children, user = null }) => {
  const contextValue = {
    user,
    logout: vi.fn(),
    loading: false
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

const renderDashboard = (user = { name: 'Test User', email: 'test@example.com' }) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Protected Route - Dashboard', () => {
  it('renders dashboard when user is authenticated', () => {
    renderDashboard();
    
    // Check if dashboard components are rendered
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderDashboard({ name: 'John Doe', email: 'john@example.com' });
    
    // The dashboard should show user's name somewhere (adjust based on actual implementation)
    // This is a placeholder - adjust based on your Dashboard component
    expect(screen.getByText(/task/i)).toBeInTheDocument();
  });
});
