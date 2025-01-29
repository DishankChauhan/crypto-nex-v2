import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function SupportSystem() {
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        userId: user.uid,
        issue,
        status: 'open',
        timestamp: Date.now()
      });
      setIssue('');
      alert('Support ticket submitted successfully!');
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      alert('Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cyber-border bg-[#0a0a1f]/80 p-6 rounded-lg">
      <h3 className="text-xl text-[#00f3ff] font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Support
      </h3>

      <form onSubmit={submitIssue} className="space-y-4">
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full bg-[#0a0a1f] border border-[#00f3ff] rounded-md px-3 py-2 min-h-[100px]"
          placeholder="Describe your issue..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="cyber-button px-4 py-2 rounded-md flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}