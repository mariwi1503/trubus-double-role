import React from 'react';
import { Bell, LogOut } from 'lucide-react';

interface ExpertHeaderProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const ExpertHeader: React.FC<ExpertHeaderProps> = ({
  userName = 'Dr. Ahli',
  userAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  onLogout
}) => {
  return (
    <header className="sticky top-0 bg-white z-40 shadow-sm">
      <div className="max-w-lg mx-auto px-4 py-3">
        {/* Logo and User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6980194cc3fba0d6df17a964_1770002796949_b36564b6.png" 
              alt="Halo Trubus" 
              className="h-10 object-contain"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Welcome Message */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Selamat datang</p>
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
            </div>
            {/* User Avatar */}
            <img 
              src={userAvatar || "/placeholder.svg"}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExpertHeader;
