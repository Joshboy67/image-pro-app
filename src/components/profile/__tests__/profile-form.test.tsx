import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/lib/test-utils';
import { ProfileForm } from '../profile-form';
import { profileService } from '@/lib/profile-service';

// Mock the profile service
jest.mock('@/lib/profile-service', () => ({
  profileService: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    uploadAvatar: jest.fn(),
  },
}));

describe('ProfileForm', () => {
  const mockProfile = {
    id: '123',
    full_name: 'John Doe',
    username: 'johndoe',
    bio: 'Test bio',
    website: 'https://example.com',
    location: 'New York',
    avatar_url: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    (profileService.getProfile as jest.Mock).mockResolvedValue(mockProfile);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile form with initial data', async () => {
    render(<ProfileForm userId="123" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/username/i)).toHaveValue('johndoe');
      expect(screen.getByLabelText(/bio/i)).toHaveValue('Test bio');
      expect(screen.getByLabelText(/website/i)).toHaveValue('https://example.com');
      expect(screen.getByLabelText(/location/i)).toHaveValue('New York');
    });
  });

  it('handles form submission', async () => {
    const updatedProfile = {
      ...mockProfile,
      full_name: 'Jane Doe',
    };

    (profileService.updateProfile as jest.Mock).mockResolvedValue(updatedProfile);

    render(<ProfileForm userId="123" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(profileService.updateProfile).toHaveBeenCalledWith('123', {
        full_name: 'Jane Doe',
      });
    });
  });

  it('displays validation errors', async () => {
    render(<ProfileForm userId="123" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'a' } });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('handles avatar upload', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockAvatarUrl = 'https://example.com/new-avatar.jpg';

    (profileService.uploadAvatar as jest.Mock).mockResolvedValue(mockAvatarUrl);

    render(<ProfileForm userId="123" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/change avatar/i)).toBeInTheDocument();
    });

    const avatarInput = screen.getByLabelText(/change avatar/i);
    fireEvent.change(avatarInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(profileService.uploadAvatar).toHaveBeenCalledWith('123', mockFile);
    });
  });

  it('displays loading state', async () => {
    (profileService.getProfile as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ProfileForm userId="123" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it('displays error state', async () => {
    const error = new Error('Failed to load profile');
    (profileService.getProfile as jest.Mock).mockRejectedValue(error);

    render(<ProfileForm userId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading profile/i)).toBeInTheDocument();
    });
  });
}); 