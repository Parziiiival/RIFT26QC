import { Transaction } from "./types";

export function generateSampleData(): Transaction[] {
  const accounts = [
    "ACC001", "ACC002", "ACC003", "ACC004", "ACC005",
    "ACC006", "ACC007", "ACC008", "ACC009", "ACC010",
    "ACC011", "ACC012", "ACC013", "ACC014", "ACC015",
  ];

  const transactions: Transaction[] = [];
  let id = 0;

  // Create cycle: ACC001 -> ACC002 -> ACC003 -> ACC001
  transactions.push({ sender_id: "ACC001", receiver_id: "ACC002", amount: 10000, timestamp: new Date().toISOString() });
  transactions.push({ sender_id: "ACC002", receiver_id: "ACC003", amount: 9500, timestamp: new Date().toISOString() });
  transactions.push({ sender_id: "ACC003", receiver_id: "ACC001", amount: 9000, timestamp: new Date().toISOString() });

  // Repeat cycle multiple times
  for (let i = 0; i < 5; i++) {
    transactions.push({ sender_id: "ACC001", receiver_id: "ACC002", amount: 8000 + Math.random() * 2000, timestamp: new Date().toISOString() });
    transactions.push({ sender_id: "ACC002", receiver_id: "ACC003", amount: 7500 + Math.random() * 2000, timestamp: new Date().toISOString() });
    transactions.push({ sender_id: "ACC003", receiver_id: "ACC001", amount: 7000 + Math.random() * 2000, timestamp: new Date().toISOString() });
  }

  // Create fan-out: ACC004 sending to many
  for (let i = 5; i < 10; i++) {
    transactions.push({
      sender_id: "ACC004",
      receiver_id: `ACC${String(i).padStart(3, "0")}`,
      amount: 5000 + Math.random() * 3000,
      timestamp: new Date().toISOString(),
    });
  }

  // Create layering chain: ACC010 -> ACC011 -> ACC012 -> ACC013 -> ACC014
  const layeringChain = ["ACC010", "ACC011", "ACC012", "ACC013", "ACC014"];
  for (let i = 0; i < layeringChain.length - 1; i++) {
    for (let j = 0; j < 3; j++) {
      transactions.push({
        sender_id: layeringChain[i],
        receiver_id: layeringChain[i + 1],
        amount: 4000 + Math.random() * 2000,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Add legitimate transactions
  for (let i = 0; i < 50; i++) {
    const sender = accounts[Math.floor(Math.random() * accounts.length)];
    let receiver = accounts[Math.floor(Math.random() * accounts.length)];
    while (receiver === sender) {
      receiver = accounts[Math.floor(Math.random() * accounts.length)];
    }
    transactions.push({
      sender_id: sender,
      receiver_id: receiver,
      amount: Math.random() * 5000,
      timestamp: new Date().toISOString(),
    });
  }

  return transactions;
}

export function generateSampleCSV(): string {
  const data = generateSampleData();
  const csv = [
    "sender_id,receiver_id,amount,timestamp",
    ...data.map(
      (t) =>
        `${t.sender_id},${t.receiver_id},${t.amount.toFixed(2)},${t.timestamp}`
    ),
  ];
  return csv.join("\n");
}

export function downloadSampleCSV() {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_transactions.csv";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
