# POD Item Template Manager

A web-based application for managing Print-on-Demand book specifications, automating calculations, and generating standardized templates for production use.

### Core Features
- Real-time book specification management with automated calculations
- Bulk data import from Excel files with validation
- Multi-format export capabilities (CSV, XML)
- Automated spine size calculations based on industry standards
- Intelligent page extent adjustment based on trim width
- Session management with save/load functionality

### Data Management
- Single entry addition with real-time validation
- Bulk import from Excel with error highlighting
- Save/load work sessions in JSON format
- Batch operations for multiple entries

### Export Capabilities
- CSV export with NEW/UPDT modes
- Individual XML generation per entry
- Batch XML export with ZIP compression
- Standardized template downloads

### Prerequisites
- Web server (Apache, Nginx, etc.)
- Modern web browser with JavaScript enabled
- No database required - file-based storage

### Setup
1. Clone repository to web server directory
2. Ensure proper file permissions
3. Access via web browser
4. No additional configuration required

### File Structure
```
├── index.html          # Main application interface
├── style.css          # Custom styling
├── script.js          # Application logic
├── favicon-32x32.png  # Browser icon
├── apple-touch-icon.png # iOS icon
└── item_templates.xlsx # Excel template
```

### Dependencies
```javascript
{
    "bootstrap": "5.3.2",
    "bootstrap-icons": "1.11.3",
    "sheetjs": "0.18.5",
    "jszip": "3.10.1"
}
```

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Paper Specifications
```javascript
const PAPER_SPECS = {
    amber_80: {
        name: 'Amber Preprint 80 gsm',
        grammage: 80,
        volume: 13
    },
    woodfree_80: {
        name: 'Woodfree 80 gsm',
        grammage: 80,
        volume: 17.5
    },
    munken_70: {
        name: 'Munken Print Cream 70 gsm',
        grammage: 70,
        volume: 18
    },
    letsgo_90: {
        name: 'LetsGo Silk 90 gsm',
        grammage: 90,
        volume: 10
    },
    matt_115: {
        name: 'Matt 115 gsm',
        grammage: 115,
        volume: 11
    },
    holmen_60: {
        name: 'Holmen Book Cream 60 gsm',
        grammage: 60,
        volume: 18
    },
    premium_mono_90: {
        name: 'Premium Mono 90 gsm',
        grammage: 90,
        volume: 9.7
    },
    premium_color_90: {
        name: 'Premium Colour 90 gsm',
        grammage: 90,
        volume: 9.7
    },
    mechanical_70: {
        name: 'Mechanical Creamy 70 gsm',
        grammage: 70,
        volume: 20
    }
}
```

### Binding Options
- Limp
- Cased

### Lamination Types
- Gloss
- Matt

### Input Validation
- Real-time field validation
- Error highlighting
- Automated corrections where possible
- Comprehensive error messaging

### Excel Import
- Standardized template format
- Bulk data validation
- Error highlighting
- Status reporting

### Session Management
- JSON-based save format
- Version tracking
- Timestamp inclusion
- Error recovery

## Validation Rules

### ISBN Validation
- 13-digit requirement
- Checksum verification
- Prefix validation (978/979)

### Title Constraints
- Maximum 58 characters
- Automatic truncation
- Special character handling

### Dimensional Rules
- Positive number validation
- Page extent divisibility rules
- Trim width thresholds

## Calculations

### Spine Size Calculation
```javascript
spineSize = (pageExtent * paperGrammage * paperVolume) / 20000
```

### Page Extent Adjustment
- ≤ 156mm trim width: Divisible by 6
- > 156mm trim width: Divisible by 4

### Binding Adjustments
- Cased binding: +4mm spine addition
- Limp binding: No adjustment
