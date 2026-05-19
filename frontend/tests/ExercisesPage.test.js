import { render, screen } from '@testing-library/react';
import ExercisesPage from '@/app/(pages)/exercises/page';
import { AuthContext } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  fetchAPI: jest.fn(),
}));

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('ExercisesPage', () => {
  beforeEach(() => {
    fetchAPI.mockReset();
    push.mockReset();
  });

  it('renders exercises loaded from the API', async () => {
    fetchAPI.mockResolvedValueOnce([
      {
        id: 'exercise-1',
        name: 'Bench Press',
        description: 'Chest builder',
        difficulty: 'intermediate',
        type: 'compound',
        equipment: 'barbell',
        mediaUrl: '',
        createdBy: 'user-1',
      },
    ]);

    render(
      <AuthContext.Provider value={{ user: { id: 'user-1', name: 'Test User' }, token: 'token', isLoading: false }}>
        <ExercisesPage />
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Chest builder')).toBeInTheDocument();
    expect(fetchAPI).toHaveBeenCalledWith('/api/exercises');
  });
});
