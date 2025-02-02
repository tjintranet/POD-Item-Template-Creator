# POD Item Template Manager

A web-based tool for managing Print-on-Demand (POD) item templates. This application allows users to create, manage, and export book specifications in a standardized format.

## Features

### Core Functionality
- Create and manage book specifications including:
  - ISBN validation (13-digit)
  - Title management (max 58 characters)
  - Trim size specifications
  - Paper type selection
  - Binding style options
  - Page extent calculations
  - Spine size auto-calculation
  - Lamination options

### Data Management
- Add multiple entries to a session
- Delete individual entries
- Save work sessions to JSON files
- Load previous work sessions
- Export data to CSV format
- Toggle between NEW and UPDATE modes for CSV generation

### Validation and Calculations
- Automatic ISBN validation with checksum verification
- Dynamic page extent adjustments based on trim width
- Automatic spine size calculations based on:
  - Page extent
  - Paper specifications
  - Binding style

### User Interface
- Clean, responsive Bootstrap-based interface
- Real-time validation feedback
- Auto-dismissing status messages
- Modal dialogs for user interactions
- Custom file naming for saved sessions

## Paper Specifications

Currently supported paper types:
```javascript
{
    amber_80: { name: 'Amber Preprint 80 gsm', grammage: 80, volume: 13 },
    woodfree_80: { name: 'Woodfree 80 gsm', grammage: 80, volume: 17.5 },
    munken_70: { name: 'Munken Print Cream 70 gsm', grammage: 70, volume: 18 },
    letsgo_90: { name: 'LetsGo Silk 90 gsm', grammage: 90, volume: 10 },
    matt_115: { name: 'Matt 115 gsm', grammage: 115, volume: 11 },
    holmen_60: { name: 'Holmen Book Cream 60 gsm', grammage: 60, volume: 18 },
    premium_mono_90: { name: 'Premium Mono 90 gsm', grammage: 90, volume: 9.7 },
    premium_color_90: { name: 'Premium Colour 90 gsm', grammage: 90, volume: 9.7 },
    mechanical_70: { name: 'Mechanical Creamy 70 gsm', grammage: 70, volume: 20 }
}
```

## Technical Implementation

### Dependencies
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.3
- SheetJS (XLSX) for Excel file handling

### File Structure
- `index.html`: Main application interface
- `script.js`: Application logic and calculations
- `style.css`: Custom styling

## Potential Enhancements

### Paper Types and Specifications
- Add support for additional paper types
- Allow custom paper specifications
- Implement paper type categorization (e.g., by use case)
- Add paper availability tracking
- Include paper cost calculations

### Data Management
- Multiple save slots
- Auto-save functionality
- Cloud storage integration
- Batch import/export capabilities
- Template system for common configurations

### Validation and Calculations
- Enhanced trim size validation
- Custom validation rules
- Advanced spine calculation formulas
- Cost estimation tools
- Production time estimates

### User Interface
- Dark mode support
- Customizable interface layouts
- Keyboard shortcuts
- Bulk editing capabilities
- Search and filter functionality

### Reporting
- Generate detailed specification sheets
- Production reports
- Cost analysis reports
- Historical data tracking
- Usage statistics

## Usage Instructions

1. Basic Entry Creation:
   - Fill in all required fields
   - Click "Add Entry" to add to the session
   - Use "Clear Fields" to reset the form

2. Saving Work:
   - Click "Save" to open save dialog
   - Enter desired filename
   - Click "Save" to download JSON file

3. Loading Previous Work:
   - Click "Load"
   - Select previously saved JSON file
   - Work session will be restored

4. Generating CSV:
   - Add required entries
   - Select NEW/UPDT mode using toggle
   - Click "Generate CSV"
   - CSV will be downloaded with timestamp

## Browser Support
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Contributing
Contributions for new features, bug fixes, and improvements are welcome. Please follow the existing code style and add appropriate documentation.

## Error Handling
The application includes comprehensive error handling for:
- Invalid ISBN numbers
- Title length restrictions
- Required field validation
- File operations
- Data format validation

Each error is displayed to the user with clear, auto-dismissing messages.

## License
[Add your license information here]
