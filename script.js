/* ==========================================
   Hedera Hash Tracker - JavaScript Logic
   ========================================== */

// Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';
const ENDPOINTS = {
    ITEMS: `${API_BASE_URL}/items`,
    TRANSACTIONS: `${API_BASE_URL}/transactions`
};

// DOM Elements
const itemForm = document.getElementById('itemForm');
const transactionForm = document.getElementById('transactionForm');
const itemsList = document.getElementById('itemsList');
const transactionsList = document.getElementById('transactionsList');
const apiStatus = document.getElementById('apiStatus');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAPIConnection();
    loadItems();
    loadTransactions();
    setupEventListeners();
    // Refresh data every 5 seconds
    setInterval(() => {
        loadItems();
        loadTransactions();
    }, 5000);
});

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    itemForm.addEventListener('submit', handleCreateItem);
    transactionForm.addEventListener('submit', handleCreateTransaction);
}

// ==========================================
// API CONNECTION CHECK
// ==========================================
async function checkAPIConnection() {
    try {
        const response = await fetch(ENDPOINTS.ITEMS);
        if (response.ok) {
            apiStatus.textContent = '🟢 API Connected';
            apiStatus.classList.add('connected');
        } else {
            throw new Error('API Error');
        }
    } catch (error) {
        apiStatus.textContent = '🔴 API Disconnected';
        apiStatus.classList.remove('connected');
        showToast('Cannot connect to API. Make sure the backend is running on localhost:8000', 'error');
    }
}

// ==========================================
// ITEMS - CRUD OPERATIONS
// ==========================================

async function loadItems() {
    try {
        const response = await fetch(ENDPOINTS.ITEMS);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error loading items:', error);
        itemsList.innerHTML = `<div class="empty-state">❌ Error loading items. Make sure the backend is running.</div>`;
    }
}

function displayItems(items) {
    if (!items || items.length === 0) {
        itemsList.innerHTML = '<div class="empty-state">📭 No items yet. Create one to get started!</div>';
        return;
    }

    itemsList.innerHTML = items.map(item => `
        <div class="item-card">
            <h4>${escapeHtml(item.name || 'Unnamed Item')}</h4>
            <p><strong>ID:</strong> ${item.id || 'N/A'}</p>
            <p><strong>Quantity:</strong> ${item.quantity || 0} units</p>
            <p class="price">💰 $${parseFloat(item.price || 0).toFixed(2)}</p>
            ${item.created_at ? `<p style="font-size: 0.8rem; margin-top: 1rem;"><strong>Created:</strong> ${new Date(item.created_at).toLocaleString()}</p>` : ''}
            <button class="btn btn-danger delete-btn" onclick="deleteItem(${item.id})">Delete</button>
        </div>
    `).join('');
}

async function handleCreateItem(e) {
    e.preventDefault();

    const itemData = {
        name: document.getElementById('itemName').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        price: parseFloat(document.getElementById('itemPrice').value)
    };

    try {
        const response = await fetch(ENDPOINTS.ITEMS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create item');
        }

        const newItem = await response.json();
        showToast(`✅ Item "${itemData.name}" created successfully!`, 'success');
        itemForm.reset();
        loadItems();
    } catch (error) {
        console.error('Error creating item:', error);
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`${ENDPOINTS.ITEMS}/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete item');
        }

        showToast('✅ Item deleted successfully!', 'success');
        loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

// ==========================================
// TRANSACTIONS - CRUD OPERATIONS
// ==========================================

async function loadTransactions() {
    try {
        const response = await fetch(ENDPOINTS.TRANSACTIONS);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const transactions = await response.json();
        displayTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
        transactionsList.innerHTML = `<div class="empty-state">❌ Error loading transactions. Make sure the backend is running.</div>`;
    }
}

function displayTransactions(transactions) {
    if (!transactions || transactions.length === 0) {
        transactionsList.innerHTML = '<div class="empty-state">📭 No transactions yet. Create one to get started!</div>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Item ID</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(txn => `
                    <tr>
                        <td>${txn.id || 'N/A'}</td>
                        <td><span class="type-badge ${txn.type || 'unknown'}">${txn.type || 'Unknown'}</span></td>
                        <td>${txn.item_id || 'N/A'}</td>
                        <td>${txn.quantity || 0}</td>
                        <td>$${parseFloat(txn.amount || 0).toFixed(2)}</td>
                        <td>${txn.created_at ? new Date(txn.created_at).toLocaleString() : 'N/A'}</td>
                        <td><button class="btn btn-danger delete-btn" onclick="deleteTransaction(${txn.id})">Delete</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    transactionsList.innerHTML = tableHTML;
}

async function handleCreateTransaction(e) {
    e.preventDefault();

    const txnData = {
        type: document.getElementById('txnType').value,
        item_id: parseInt(document.getElementById('txnItemId').value),
        quantity: parseInt(document.getElementById('txnQuantity').value),
        amount: parseFloat(document.getElementById('txnAmount').value)
    };

    try {
        const response = await fetch(ENDPOINTS.TRANSACTIONS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(txnData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create transaction');
        }

        const newTransaction = await response.json();
        showToast(`✅ ${txnData.type.toUpperCase()} transaction created successfully!`, 'success');
        transactionForm.reset();
        loadTransactions();
    } catch (error) {
        console.error('Error creating transaction:', error);
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

async function deleteTransaction(txnId) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        const response = await fetch(`${ENDPOINTS.TRANSACTIONS}/${txnId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete transaction');
        }

        showToast('✅ Transaction deleted successfully!', 'success');
        loadTransactions();
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showToast(`❌ Error: ${error.message}`, 'error');
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
