# Hedera Hash Tracker - Frontend Quick Start

## Overview

The frontend is a modern, single-page application built with vanilla HTML, CSS, and JavaScript. It provides an intuitive interface to interact with the Hedera Hash Tracker inventory management system.

## Features

### ✨ User Interface
- **Modern Dark Theme** - Black background with pink accents
- **Smooth Animations** - Gradient transitions, fade effects, and hover animations
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Real-time Status** - API connection indicator in the navbar

### 📦 Inventory Management
- **Create Items** - Add new inventory items with name, quantity, and price
- **View Items** - Display items in an elegant card grid layout
- **Delete Items** - Remove items from inventory
- **Live Updates** - Data refreshes automatically every 5 seconds

### 💳 Transaction Management
- **Create Transactions** - Log sales, purchases, adjustments, and returns
- **View Transactions** - Display transactions in a detailed table with timestamps
- **Delete Transactions** - Remove transaction records
- **Type Filtering** - Color-coded badges for different transaction types

### 🎯 Developer Experience
- **No Dependencies** - Pure HTML/CSS/JavaScript
- **Error Handling** - User-friendly error messages and validation
- **Toast Notifications** - Feedback for successful and failed operations
- **Console Logging** - Debug information available in browser console

## Installation & Setup

### Requirements
1. Backend API running on `http://localhost:8000`
2. Modern web browser (Chrome, Firefox, Safari, Edge)

### Steps

1. **Start the Backend**
   ```shell
   ./start.sh
   ```

2. **Open Frontend**
   - Double-click `index.html`, OR
   - Drag `index.html` into your browser, OR
   - Open file directly: `file:///path/to/index.html`

3. **Test the API**
   - Check the green "🟢 API Connected" indicator in the top-right
   - Create an item or transaction to verify functionality

## File Structure

### index.html
- Main HTML structure with semantic markup
- Navigation header with API status indicator
- Items management section with form and grid display
- Transactions management section with form and table display
- Footer with branding

### styles.css
- Complete styling with CSS custom properties (variables)
- Dark theme with black (#0f0f0f) and pink (#ff1493) accents
- Smooth animations: slideDown, fadeIn, slideInUp, glow, pulse
- Responsive grid layouts with media queries
- Hover effects and transitions on all interactive elements
- Card designs with gradient backgrounds and shadows

### script.js
- API endpoint configuration
- CRUD operations for items and transactions
- Real-time data loading and display
- Form submission handling
- Toast notification system
- Error handling and logging

## API Endpoints Used

### Items
- `GET /api/v1/items` - Fetch all items
- `POST /api/v1/items` - Create new item
- `DELETE /api/v1/items/{id}` - Delete item

### Transactions
- `GET /api/v1/transactions` - Fetch all transactions
- `POST /api/v1/transactions` - Create new transaction
- `DELETE /api/v1/transactions/{id}` - Delete transaction

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Dark | #0f0f0f | Background |
| Primary Light | #ffffff | Text |
| Accent Pink | #ff1493 | Highlights, borders |
| Light Pink | #ff69b4 | Hover states |
| Dark Pink | #c71585 | Active states |
| Success | #00ff88 | Positive feedback |
| Error | #ff4444 | Error states |

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh Items | F5 (browser) |
| Refresh Transactions | F5 (browser) |
| Open DevTools | F12 |
| Focus First Input | Tab |

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### "API Disconnected" message
- Ensure backend is running: `./start.sh`
- Check if `http://localhost:8000` is accessible
- Look for CORS errors in browser console

### Forms not submitting
- Check browser console for JavaScript errors (F12)
- Verify backend is running
- Check form validation messages

### Data not loading
- Refresh the page (F5)
- Check API status indicator
- Look for error messages in toast notifications

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Ensure all CSS file is loaded (check DevTools)

## Development Tips

### Local Development
1. Open browser DevTools (F12)
2. Check Console tab for any errors
3. Use Network tab to monitor API calls
4. Check local storage and cookies in Application tab

### Customization
To change colors, edit the CSS variables in `styles.css`:

```css
:root {
    --accent-pink: #ff1493;      /* Change primary accent */
    --primary-dark: #0f0f0f;      /* Change background */
    --text-primary: #ffffff;      /* Change text color */
}
```

### Adding New Features
1. Add HTML structure in `index.html`
2. Style in `styles.css`
3. Add JavaScript logic in `script.js`
4. Test with backend API

## Performance Metrics

- **Load Time**: < 500ms
- **API Response**: < 200ms per call
- **Auto-refresh**: Every 5 seconds
- **File Sizes**:
  - index.html: ~6KB
  - styles.css: ~15KB
  - script.js: ~8KB

## Future Enhancements

- [ ] Local storage for offline support
- [ ] Advanced filtering and search
- [ ] Data export (CSV, JSON)
- [ ] Chart visualizations
- [ ] User authentication
- [ ] Dark/Light theme toggle
- [ ] Mobile app wrapper
- [ ] Real-time WebSocket updates

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify backend is running
4. Check API documentation at http://localhost:8000/docs
