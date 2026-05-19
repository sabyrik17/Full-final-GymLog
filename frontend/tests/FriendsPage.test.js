import { render, screen } from '@testing-library/react';
import FriendsPage from '@/app/(pages)/friends/page';
import { AuthContext } from '@/context/AuthContext';
import { RealtimeContext } from '@/context/RealtimeContext';
import { fetchAPI } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  fetchAPI: jest.fn(),
}));

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('FriendsPage', () => {
  beforeEach(() => {
    fetchAPI.mockReset();
    push.mockReset();
  });

  it('renders real friends loaded from the API', async () => {
    fetchAPI.mockImplementation((endpoint) => {
      if (endpoint.startsWith('/api/friends/requests')) {
        return Promise.resolve({ incoming: [], outgoing: [] });
      }

      return Promise.resolve({
        friends: [
          {
            id: 'friend-1',
            name: 'Training Friend',
            email: 'friend@test.com',
            avatar: '',
            canViewDiary: true,
          },
        ],
        searchResults: [],
      });
    });

    render(
      <AuthContext.Provider value={{ token: 'token', isLoading: false }}>
        <RealtimeContext.Provider value={{ onlineUsers: [{ id: 'friend-1', name: 'Training Friend', isTraining: false }] }}>
          <FriendsPage />
        </RealtimeContext.Provider>
      </AuthContext.Provider>
    );

    expect(await screen.findByText('Training Friend')).toBeInTheDocument();
    expect(screen.getByText(/в сети/i)).toBeInTheDocument();
  });
});
