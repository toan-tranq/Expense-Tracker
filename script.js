// State Management: Array to store transactions
let transactions = [];

// DOM Elements
const transactionForm = document.getElementById('transactionForm');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const balanceAmount = document.querySelector('.balance-amount');
const incomeAmount = document.querySelector('.income-amount');
const expenseAmount = document.querySelector('.expense-amount');
const historyList = document.querySelector('.history-list');

// Initialize the app
init();

// Initialize function - load transactions from LocalStorage and update UI
function init() {
    loadTransactions();
    updateUI();
}

// Load transactions from LocalStorage
function loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        transactions = [];
    }
}

// Save transactions to LocalStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Add Transaction: Get form values and add to transactions array
function addTransaction(e) {
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Validate inputs
    if (text === '') {
        alert('Please enter a transaction name');
        return;
    }

    if (isNaN(amount) || amount === 0) {
        alert('Please enter a valid amount (cannot be zero)');
        return;
    }

    // Create transaction object with ID, text, and amount
    const transaction = {
        id: generateID(),
        text: text,
        amount: amount
    };

    // Add transaction to array
    transactions.push(transaction);

    // Save to LocalStorage
    saveTransactions();

    // Update UI
    updateUI();

    // Reset form
    transactionForm.reset();
}

// Generate unique ID for transactions
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Update UI: Calculate and update Total Balance, Income, Expense, and render transactions
function updateUI() {
    // Calculate totals
    const amounts = transactions.map(transaction => transaction.amount);
    
    // Calculate total balance
    const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);
    
    // Calculate income (positive amounts)
    const income = amounts
        .filter(amount => amount > 0)
        .reduce((acc, amount) => acc + amount, 0)
        .toFixed(2);
    
    // Calculate expense (negative amounts, displayed as positive)
    const expense = Math.abs(amounts
        .filter(amount => amount < 0)
        .reduce((acc, amount) => acc + amount, 0))
        .toFixed(2);

    // Update balance display
    balanceAmount.textContent = `$${total}`;

    // Update income display
    incomeAmount.textContent = `$${income}`;

    // Update expense display
    expenseAmount.textContent = `$${expense}`;

    // Render transaction list
    renderTransactions();
}

// Render transactions list
function renderTransactions() {
    // Clear existing content
    historyList.innerHTML = '';

    // If no transactions, show message
    if (transactions.length === 0) {
        historyList.innerHTML = '<div class="history-item"><span class="history-text">No transactions yet</span></div>';
        return;
    }

    // Create and append transaction items
    transactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.classList.add('history-item');
        
        // Add class based on transaction type
        if (transaction.amount > 0) {
            transactionEl.classList.add('income-item');
        } else {
            transactionEl.classList.add('expense-item');
        }

        transactionEl.innerHTML = `
            <span class="history-text">${transaction.text}</span>
            <span class="history-amount ${transaction.amount > 0 ? 'income' : 'expense'}">${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
        `;

        historyList.appendChild(transactionEl);
    });
}

// Delete Transaction: Remove transaction by ID
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // Save to LocalStorage
    saveTransactions();
    
    // Update UI
    updateUI();
}

// Clear All Transactions
function clearAllTransactions() {
    if (transactions.length === 0) {
        alert('No transactions to clear');
        return;
    }

    if (confirm('Are you sure you want to clear all transactions?')) {
        transactions = [];
        saveTransactions();
        updateUI();
    }
}

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);

