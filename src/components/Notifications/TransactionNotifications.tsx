import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

interface Notification {
  id: string;
  type: 'payment' | 'batch' | 'schedule';
  message: string;
  timestamp: number;
  read: boolean;
}

export function TransactionNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="relative">
      <Bell className="h-6 w-6 text-[#00f3ff] cursor-pointer" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#ff00ff] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notifications.length}
        </span>
      )}
    </div>
  );
}