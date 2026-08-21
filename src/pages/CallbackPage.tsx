import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleSignInCallback, useLogto } from '@logto/react';
import { useAuthStore } from '@/stores/authStore';
import { Leaf, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

export const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { fetchUserInfo, getIdTokenClaims } = useLogto();

  const { isLoading, error } = useHandleSignInCallback(async () => {
    try {
      const userInfo = await fetchUserInfo();
      const claims = await getIdTokenClaims();
      
      const email = userInfo?.email || claims?.email || 'student@binus.ac.id';
      const fullName = userInfo?.name || (claims as any)?.name || 'Mahasiswa BINUS';
      const nim = (userInfo?.custom_data as any)?.nim || (claims as any)?.nim || email.split('@')[0];
      const role = ((claims as any)?.roles?.[0] === 'verifier' ? 'VERIFIER' : 'STUDENT') as 'STUDENT' | 'VERIFIER';
      const facultyName = (userInfo?.custom_data as any)?.faculty || 'School of Computer Science';

      const loggedUser: UserProfile = {
        id: userInfo?.sub || `logto-${Date.now()}`,
        nim,
        email,
        fullName,
        role,
        facultyName,
        totalGreenCoins: 50,
        totalSatPoints: 0,
        totalCarbonSaved: 0.0,
        streakDays: 1,
        createdAt: new Date().toISOString(),
      };

      setUser(loggedUser);
      navigate('/');
    } catch (err) {
      console.error('Error extracting Logto user info:', err);
      navigate('/');
    }
  });

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl max-w-sm">
          <h2 className="text-sm font-black text-rose-800">Autentikasi Logto Gagal</h2>
          <p className="text-xs text-rose-600 mt-1">{error.message}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-3 px-4 py-2 bg-rose-700 text-white rounded-2xl text-xs font-bold"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl eco-gradient-hero flex items-center justify-center mx-auto shadow-neon-glow animate-bounce">
        <Leaf className="w-9 h-9 text-white" />
      </div>
      <h2 className="text-base font-black text-text-primary mt-4 flex items-center justify-center gap-1.5">
        <Sparkles className="w-4 h-4 text-gold-neon animate-spin" />
        Memproses Single Sign-On Logto...
      </h2>
      <p className="text-xs text-text-secondary mt-1">Menghubungkan identitas mahasiswa BINUS ke I-CAN</p>
    </div>
  );
};
