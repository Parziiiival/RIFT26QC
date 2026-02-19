import { Transaction } from "./types";

export function generateSampleTransactions(count: number = 500): Transaction[] {
  const transactions: Transaction[] = [];
  const accountIds = Array.from({ length: 50 }, (_, i) => `ACC${String(i + 1).padStart(3, "0")}`);
  
  // Generate fraud rings
  const fraudRing1 = [accountIds[0], accountIds[1], accountIds[2]];
  const fraudRing2 = [accountIds[5], accountIds[6], accountIds[7], accountIds[8]];
  const fraudRing3 = [accountIds[10], accountIds[11]];
  
  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let sender: string;
    let receiver: string;
    let amount: number;
    
    // 30% fraud ring transactions
    if (rand < 0.1) {
      // Cycle in ring 1
      sender = fraudRing1[i % fraudRing1.length];
      receiver = fraudRing1[(i + 1) % fraudRing1.length];
      amount = Math.random() * 50000 + 1000;
    } else if (rand < 0.2) {
      // Cycle in ring 2
      sender = fraudRing2[i % fraudRing2.length];
      receiver = fraudRing2[(i + 1) % fraudRing2.length];
      amount = Math.random() * 100000 + 5000;
    } else if (rand < 0.3) {
      // Fan-out from ring 3
      sender = fraudRing3[0];
      receiver = accountIds[Math.floor(Math.random() * accountIds.length)];
      amount = Math.random() * 30000 + 500;
    } else {
      // Normal transactions
      sender = accountIds[Math.floor(Math.random() * accountIds.length)];
      receiver = accountIds[Math.floor(Math.random() * accountIds.length)];
      amount = Math.random() * 10000 + 100;
    }
    
    if (sender !== receiver) {
      transactions.push({
        sender_id: sender,
        receiver_id: receiver,
        amount: Math.round(amount * 100) / 100,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  
  return transactions;
}

export function generateSampleCSV(count: number = 500): string {
  const transactions = generateSampleTransactions(count);
  const lines = ["sender_id,receiver_id,amount,timestamp"];
  
  transactions.forEach(tx => {
    lines.push(`${tx.sender_id},${tx.receiver_id},${tx.amount},${tx.timestamp}`);
  });
  
  return lines.join("\n");
}

export function downloadSampleCSV() {
  const csv = generateSampleCSV(500);
  const element = document.createElement("a");
  const file = new Blob([csv], { type: "text/csv" });
  element.href = URL.createObjectURL(file);
  element.download = "sample-transactions.csv";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
