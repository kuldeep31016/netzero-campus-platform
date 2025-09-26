import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AdminWaste from './AdminWaste';

// Mock the useAuth hook to return an admin user
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    userProfile: {
      uid: 'test-admin',
      email: 'admin@test.com',
      role: 'admin',
      fullName: 'Test Admin',
      department: 'Administration',
      employeeId: 'EMP001',
      createdAt: new Date(),
    },
    user: {
      uid: 'test-admin',
      email: 'admin@test.com',
      role: 'admin',
      fullName: 'Test Admin',
      department: 'Administration',
      employeeId: 'EMP001',
      createdAt: new Date(),
    },
    loading: false,
  }),
}));

// Mock the recharts components
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  BarChart: () => <div data-testid="bar-chart">Bar Chart</div>,
  Bar: () => <div>Bar</div>,
  LineChart: () => <div data-testid="line-chart">Line Chart</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>X Axis</div>,
  YAxis: () => <div>Y Axis</div>,
  CartesianGrid: () => <div>Cartesian Grid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: () => <div data-testid="pie-chart">Pie Chart</div>,
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
}));

// Mock the setTimeout function to resolve immediately
jest.useFakeTimers();

describe('AdminWaste', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <AdminWaste />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    renderComponent();
    
    // Fast-forward the timer
    jest.advanceTimersByTime(1000);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Waste Management Dashboard')).toBeInTheDocument();
    });
  });

  it('displays the new filter options', async () => {
    renderComponent();
    
    // Fast-forward the timer
    jest.advanceTimersByTime(1000);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Timeframe')).toBeInTheDocument();
      expect(screen.getByText('Building')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
      expect(screen.getByText('All Buildings')).toBeInTheDocument();
    });
  });

  it('allows filtering by timeframe', async () => {
    renderComponent();
    
    // Fast-forward the timer
    jest.advanceTimersByTime(1000);
    
    // Wait for the component to load
    await waitFor(() => {
      const timeframeSelect = screen.getByLabelText('Timeframe') as HTMLSelectElement;
      expect(timeframeSelect).toBeInTheDocument();
      
      // Check that the select has the expected options
      expect(screen.getByText('All Time')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    });
  });

  it('allows filtering by building', async () => {
    renderComponent();
    
    // Fast-forward the timer
    jest.advanceTimersByTime(1000);
    
    // Wait for the component to load
    await waitFor(() => {
      const buildingSelect = screen.getByLabelText('Building') as HTMLSelectElement;
      expect(buildingSelect).toBeInTheDocument();
      
      // Check that the select has the expected options
      expect(screen.getByText('All Buildings')).toBeInTheDocument();
      expect(screen.getByText('Main Building')).toBeInTheDocument();
      expect(screen.getByText('Engineering Block')).toBeInTheDocument();
    });
  });
});