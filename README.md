# POD Item Template Manager

A web-based application for managing Print-on-Demand book specifications, automating calculations, and generating standardized templates for production use.

## Overview

This application helps publishers and book producers manage book metadata, calculate specifications, and generate export formats needed for print-on-demand book production. It automates complex calculations like spine size based on paper type and provides comprehensive validation for all book specifications.

## Core Features

- **Real-time Specification Management**
  - Automated spine size calculations based on paper type, page extent, and binding style
  - Intelligent page extent adjustment based on trim width thresholds
  - Support for plate sections with customizable insertion points
  - Comprehensive validation with visual feedback

- **Robust Data Management**
  - Individual entry creation with real-time validation
  - Bulk import from Excel with error highlighting and reporting
  - Save/load functionality with JSON-based session storage
  - Multiple selection and batch operations

- **Production-Ready Export Options**
  - CSV export with NEW/UPDT modes for production systems
  - Individual and batch XML generation
  - ZIP compression for multiple XML exports
  - Standardized template downloads

## Technical Details

### Paper Specifications
The application includes predefined paper specifications with accurate grammage and volume metrics:
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
    mechanical_70: { name: 'Enso 70 gsm', grammage: 70, volume: 20 }
}
```

### Calculations
- **Spine Size Calculation**: `spineSize = (pageExtent * paperGrammage * paperVolume) / 20000`
- **Binding Adjustments**: Cased binding adds 4mm to spine size
- **Page Extent Rules**:
  - For trim width ≤ 156mm: Must be divisible by 6
  - For trim width > 156mm: Must be divisible by 4

### Validation Rules
- **ISBN Validation**: 13-digit requirement with checksum verification and prefix validation (978/979)
- **Title Constraints**: Maximum 58 characters with automatic truncation
- **Book Dimensions**: Positive number validation with trim width threshold handling
- **Plate Sections**: Validation for insertion points and paper types

## Prerequisites

- Web server (Apache, Nginx, etc.)
- Modern web browser with JavaScript enabled
- No database required - file-based storage

## Installation

1. Clone or download this repository to your web server directory
2. Ensure all files have proper permissions
3. Access via web browser
4. No additional configuration required

## File Structure

```
├── index.html          # Main application interface
├── style.css           # Custom styling
├── script.js           # Application logic
├── favicon-32x32.png   # Browser icon
├── apple-touch-icon.png # iOS icon
├── item_templates.xlsm  # Excel template
└── User_Guide.pdf      # PDF user documentation
```

## Dependencies

The application uses the following libraries:
- Bootstrap 5.3.2
- Bootstrap Icons 1.11.3
- SheetJS 0.18.5
- JSZip 3.10.1

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Features in Detail

### Single Entry Management
- Comprehensive form with real-time validation
- Automated spine size calculation
- Support for up to two plate sections
- Intelligent page extent adjustment

### Bulk Data Management
- Excel import with validation
- Error highlighting for invalid cells
- Batch operations for multiple entries
- Delete all functionality

### Export Options
- CSV generation with NEW/UPDT modes
- Single XML download
- Batch XML download with ZIP
- Save/load work sessions

### Data Validation
- Real-time field validation
- Error highlighting and messaging
- Automated corrections where possible
- ISBN checksum verification