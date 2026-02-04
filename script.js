/**
 * ==========================================
 * Hedera Hash Tracker - Frontend Application
 * ==========================================
 * 
 * This file contains all client-side JavaScript logic for the inventory management system.
 * It handles:
 * - API communication with the backend (FastAPI on port 8001)
 * - User interface updates and interactions
 * - Form submission handling for items and transactions
 * - Real-time data display with 50-second refresh intervals
 * - User notifications via toast messages
 * 
 * Architecture:
 * - Vanilla JavaScript (no frameworks)
 * - RESTful API calls to FastAPI backend
 * - Auto-refresh: Items and transactions update every 50 seconds
 * - DOM manipulation for dynamic content rendering
 * 
 * Dependencies: None (vanilla JS)
 * Tested with: Chrome, Firefox, Safari
 */

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

/** @constant {string} API_BASE_URL - Backend API base URL */
const API_BASE_URL = 'http://localhost:8001/api/v1';

/**
 * API endpoints configuration
 * Maps logical endpoint names to full URLs for easier management
 * @type {Object}
 */
const ENDPOINTS = {
    ITEMS: `${API_BASE_URL}/items`,          // Items CRUD operations
    TRANSACTIONS: `${API_BASE_URL}/transactions` // Transactions CRUD operations
};

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================

/** @type {HTMLFormElement} Form for creating new inventory items */
const itemForm = document.getElementById('itemForm');

/** @type {HTMLFormElement} Form for recording new transactions */
const transactionForm = document.getElementById('transactionForm');

/** @type {HTMLDivElement} Container for displaying all inventory items */
const itemsList = document.getElementById('itemsList');

/** @type {HTMLDivElement} Container for displaying all transactions */
const transactionsList = document.getElementById('transactionsList');

/** @type {HTMLSpanElement} Status indicator showing API connection state */
const apiStatus = document.getElementById('apiStatus');

// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

/**
 * Initializes the application when the DOM is fully loaded.
 * Performs:
 * 1. API connection verification
 * 2. Initial data load (items and transactions)
 * 3. Event listener setup
 * 4. Auto-refresh timer configuration (50-second intervals)
 * 
 * The 50-second refresh prevents excessive API calls while keeping data relatively current
 */
document.addEventListener('DOMContentLoaded', () => {
    // Test API connectivity and update status indicator
    checkAPIConnection();
    
    // Load initial data from backend
    loadItems();
    loadTransactions();
    
    // Attach event listeners to forms
    setupEventListeners();
    
    // Auto-refresh data every 50 seconds to keep UI synchronized with backend
    // This prevents excessive API calls while maintaining reasonable data freshness
    setInterval(() => {
        loadItems();
        loadTransactions();
    }, 50000);
});

// ==========================================
// EVENT LISTENERS
// ==========================================

/**
 * Sets up all form submission event listeners.
 * This separates event binding from DOM manipulation for better code organization.
 * Called during initialization to attach handlers to form elements.
 */
function setupEventListeners() {
    // When user submits the item creation form
    itemForm.addEventListener('submit', handleCreateItem);
    
    // When user submits the transaction creation form
    transactionForm.addEventListener('submit', handleCreateTransaction);
}

// ==========================================
// API CONNECTION VERIFICATION
// ==========================================

/**
 * Checks if the backend API is accessible and updates the status indicator.
 * Makes a simple GET request to the items endpoint to verify connectivity.
 * 
 * Success: Updates status indicator to green (🟢 API Connected)
 * Failure: Updates status indicator to red (🔴 API Disconnected) and shows error toast
 * 
 * Called during app initialization and helps diagnose backend issues.
 */
async function checkAPIConnection() {
    try {
        // Attempt to reach the API with a simple GET request
        const response = await fetch(ENDPOINTS.ITEMS);
        
        if (response.ok) {
            // API is reachable and responding
            apiStatus.textContent = '🟢 API Connected';
            apiStatus.classList.add('connected');
        } else {
            // API returned an error status code
            throw new Error('API Error');
        }
    } catch (error) {
        // Network error, timeout, or other connection issue
        apiStatus.textContent = '🔴 API Disconnected';
        apiStatus.classList.remove('connected');
        showToast('Cannot connect to API. Make sure the backend is running on localhost:8001', 'error');
    }
}

// ==========================================
// ITEMS - CRUD OPERATIONS
// ==========================================
// Handles Create, Read, Update, Delete operations for inventory items
// Items represent individual products in the inventory system
// Each item has: id, name, quantity, price, created_at

/**
 * Fetches all inventory items from the backend API and displays them.
 * 
 * Flow:
 * 1. Make GET request to /api/v1/items
 * 2. Parse JSON response
 * 3. Pass data to displayItems() for rendering
 * 4. Handle errors gracefully with user-friendly messages
 * 
 * Error Handling:
 * - Network errors: Show offline message
 * - HTTP errors: Log error and show helpful message
 * - Empty results: Show "no items" placeholder
 * 
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * Renders inventory items as HTML cards in the DOM.
 * 
 * Responsibilities:
 * - Validate data (check for empty/null items)
 * - Generate HTML for each item with formatted values
 * - Handle XSS security by escaping HTML in user-entered text
 * - Format prices to 2 decimal places
 * - Convert timestamps to readable local date format
 * - Attach delete button with inline onclick handler
 * 
 * Security:
 * - All user input (item.name) is escaped using escapeHtml() to prevent XSS attacks
 * 
 * @param {Array<Object>} items - Array of item objects from API
 * @param {number} items[].id - Unique item identifier
 * @param {string} items[].name - Item product name
 * @param {number} items[].quantity - Stock quantity
 * @param {number} items[].price - Unit price
 * @param {string} items[].created_at - ISO timestamp of creation
 * @returns {void}
 */
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

/**
 * Form submission handler for creating new inventory items.
 * 
 * Process:
 * 1. Prevent default form submission behavior
 * 2. Extract form data (name, quantity, price)
 * 3. Validate data types (parse to int/float as needed)
 * 4. Send POST request to backend
 * 5. On success: Reset form, reload items, show success toast
 * 6. On error: Show error toast with details
 * 
 * Form Fields:
 * - itemName: Product name (string)
 * - itemQuantity: Initial stock quantity (integer, >= 0)
 * - itemPrice: Unit price (float, >= 0)
 * 
 * Error Handling:
 * - Backend validation errors (e.g., invalid quantity) are shown in error toast
 * - Network errors are caught and displayed
 * - Form is not reset until successful creation
 * 
 * @async
 * @param {Event} e - Form submission event
 * @returns {Promise<void>}
 */
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

/**
 * Deletes an inventory item from the system.
 * 
 * Process:
 * 1. Show confirmation dialog (prevents accidental deletion)
 * 2. If user cancels: Function exits
 * 3. If user confirms: Send DELETE request to backend
 * 4. On success: Reload items list and show success toast
 * 5. On error: Show error toast with details
 * 
 * Security Notes:
 * - User confirmation required before deletion (UX safety)
 * - Backend enforces authorization (if needed in future)
 * - Deletion is permanent (no undo)
 * 
 * @async
 * @param {number} itemId - ID of the item to delete
 * @returns {Promise<void>}
 */
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
// Handles Create, Read operations for inventory transactions
// Transactions represent movements of items (sales, purchases, adjustments, returns)
// Each transaction has: id, type, item_id, quantity, amount, created_at
// Transaction types: 'sale', 'purchase', 'adjustment', 'return'

/**
 * Fetches all transactions from the backend API and displays them in a table.
 * 
 * Flow:
 * 1. Make GET request to /api/v1/transactions
 * 2. Parse JSON response
 * 3. Pass data to displayTransactions() for rendering
 * 4. Handle errors gracefully with user-friendly messages
 * 
 * Note: Transactions are sorted by date (newest first) via backend query
 * 
 * @async
 * @returns {Promise<void>}
 */
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

/**
 * Renders transactions as an HTML table in the DOM.
 * 
 * Responsibilities:
 * - Validate data (check for empty/null transactions)
 * - Generate HTML table with styled rows
 * - Display transaction details in columns: ID, Type, Item ID, Quantity, Amount, Date
 * - Apply CSS styling for transaction type badges
 * - Format monetary amounts to 2 decimal places
 * - Convert timestamps to readable local date format
 * - Attach delete button to each transaction row
 * 
 * Table Structure:
 * - Header row with column labels
 * - One data row per transaction
 * - Type badge uses CSS class based on transaction type (sale, purchase, etc)
 * - Delete button calls deleteTransaction() with transaction ID
 * 
 * @param {Array<Object>} transactions - Array of transaction objects from API
 * @param {number} transactions[].id - Unique transaction identifier
 * @param {string} transactions[].type - Transaction type (sale, purchase, adjustment, return)
 * @param {number} transactions[].item_id - ID of related item
 * @param {number} transactions[].quantity - Quantity involved in transaction
 * @param {number} transactions[].amount - Transaction amount (in dollars)
 * @param {string} transactions[].created_at - ISO timestamp of transaction
 * @returns {void}
 */
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

/**
 * Form submission handler for recording new transactions.
 * 
 * Process:
 * 1. Prevent default form submission behavior
 * 2. Extract form data (type, item_id, quantity, amount)
 * 3. Validate data types (parse to int/float as needed)
 * 4. Send POST request to backend
 * 5. On success: Reset form, reload transactions, show success toast
 * 6. On error: Show error toast with details
 * 
 * Form Fields:
 * - txnType: Transaction type (select: sale, purchase, adjustment, return)
 * - txnItemId: ID of item involved (integer)
 * - txnQuantity: Quantity involved (integer, > 0)
 * - txnAmount: Transaction amount (float, >= 0)
 * 
 * Error Handling:
 * - Backend validation errors are shown in error toast
 * - Network errors are caught and displayed
 * - Form is not reset until successful creation
 * 
 * @async
 * @param {Event} e - Form submission event
 * @returns {Promise<void>}
 */
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

/**
 * Deletes a transaction record from the system.
 * 
 * Process:
 * 1. Show confirmation dialog (prevents accidental deletion)
 * 2. If user cancels: Function exits
 * 3. If user confirms: Send DELETE request to backend
 * 4. On success: Reload transactions list and show success toast
 * 5. On error: Show error toast with details
 * 
 * Note: Deletion is permanent. Consider adding audit logging in future versions.
 * 
 * @async
 * @param {number} txnId - ID of the transaction to delete
 * @returns {Promise<void>}
 */
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
// UTILITY FUNCTIONS & HELPERS
// ==========================================

/**
 * Displays a temporary notification message (toast) to the user.
 * 
 * Features:
 * - Creates a new DOM element for each toast (supports stacking)
 * - Smooth fade-in animation (0.3s)
 * - Auto-hides after 3 seconds
 * - Smooth fade-out animation (0.3s) before removal
 * - Multiple toasts can appear simultaneously and stack
 * - Supports different message types with CSS styling (success, error)
 * 
 * Animation Timeline:
 * 1. Toast created with opacity: 0
 * 2. Add 'show' class (10ms delay) → CSS transition fades in over 0.3s
 * 3. Wait 3 seconds
 * 4. Remove 'show' class → CSS transition fades out over 0.3s
 * 5. Delete DOM element (300ms after fade-out starts)
 * 
 * CSS Dependencies:
 * - .toast: Base styling (position, padding, colors)
 * - .toast.show: Visible state (opacity: 1)
 * - .toast:not(.show): Hidden state (opacity: 0)
 * - transition property: Handles smooth fade animations
 * 
 * @param {string} message - Text to display in the toast
 * @param {string} [type='success'] - Toast type for styling: 'success' or 'error'
 * @returns {void}
 */
function showToast(message, type = 'success') {
    // Create a new toast element for each notification
    const newToast = document.createElement('div');
    newToast.className = `toast ${type}`;
    newToast.textContent = message;
    
    // Add to the document
    document.body.appendChild(newToast);
    
    // Trigger the show animation
    setTimeout(() => {
        newToast.classList.add('show');
    }, 10);
    
    // Remove after timeout with fade-out
    setTimeout(() => {
        newToast.classList.remove('show');
        // Remove element after fade-out completes
        setTimeout(() => {
            newToast.remove();
        }, 300);
    }, 3000);
}

/**
 * Escapes HTML special characters in a string to prevent XSS attacks.
 * 
 * Security Purpose:
 * - Prevents malicious HTML/JavaScript from being injected via user input
 * - Required because we use innerHTML to render user-entered item names
 * - Example: If user enters "<img src=x onerror='alert(1)'>", this escapes it
 * 
 * Character Replacements:
 * - & → &amp;   (ampersand)
 * - < → &lt;    (less-than)
 * - > → &gt;    (greater-than)
 * - " → &quot;  (double quote)
 * - ' → &#039;  (single quote/apostrophe)
 * 
 * Usage:
 * - Always called before inserting item.name into HTML
 * - Required whenever user input is displayed in DOM
 * - Not needed for textContent assignments (already safe)
 * 
 * @param {string} unsafe - Unescaped string potentially containing HTML
 * @returns {string} HTML-escaped string safe for insertion into DOM
 * @example
 * escapeHtml("<img src=x onerror='alert(1)'>")
 * // Returns: "&lt;img src=x onerror='alert(1)'&gt;"
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
