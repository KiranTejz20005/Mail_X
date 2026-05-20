import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GuestModeButtonProps {
  className?: string;
  label?: string;
  onAfterNavigate?: () => void;
}

export function GuestModeButton({
  className = 'btn-secondary flex w-full items-center justify-center gap-2 py-3',
  label = 'Continue as Guest',
  onAfterNavigate,
}: GuestModeButtonProps) {
  const navigate = useNavigate();
  const { enterGuestMode } = useAuth();

  const handleGuest = () => {
    enterGuestMode();
    onAfterNavigate?.();
    navigate('/content');
  };

  return (
    <button type="button" onClick={handleGuest} className={className}>
      <UserRound className="h-4 w-4" />
      {label}
    </button>
  );
}
