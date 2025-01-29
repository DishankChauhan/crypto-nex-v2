import { ethers } from 'ethers';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface SecurityAlert {
  type: 'suspicious_activity' | 'rate_limit' | 'large_transaction';
  userId: string;
  details: string;
  timestamp: number;
}

export class SecurityMonitor {
  private static LARGE_TRANSACTION_THRESHOLD = ethers.utils.parseEther('1.0'); // 1 ETH
  private static MAX_TRANSACTIONS_PER_HOUR = 5;

  static async checkTransactionLimit(userId: string): Promise<boolean> {
    const oneHourAgo = Date.now() - 3600000;
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      where('timestamp', '>=', oneHourAgo)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size < this.MAX_TRANSACTIONS_PER_HOUR;
  }

  static async detectFraud(
    userId: string,
    amount: ethers.BigNumber,
    recipientAddress: string
  ): Promise<boolean> {
    // Check for large transactions
    if (amount.gte(this.LARGE_TRANSACTION_THRESHOLD)) {
      await this.createAlert({
        type: 'large_transaction',
        userId,
        details: `Large transaction detected: ${ethers.utils.formatEther(amount)} ETH`,
        timestamp: Date.now()
      });
      return true;
    }

    // Check for rapid successive transactions
    const hasReachedLimit = !(await this.checkTransactionLimit(userId));
    if (hasReachedLimit) {
      await this.createAlert({
        type: 'rate_limit',
        userId,
        details: 'Transaction rate limit exceeded',
        timestamp: Date.now()
      });
      return true;
    }

    return false;
  }

  private static async createAlert(alert: SecurityAlert) {
    await addDoc(collection(db, 'security_alerts'), alert);
  }
}