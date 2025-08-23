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

- **Enhanced Data Management**
  - Individual entry creation with real-time validation
  - Bulk import from Excel with error highlighting and reporting
  - Advanced search functionality by ISBN (exact and partial matches)
  - Complete editing capabilities for all imported data
  - Visual indicators for modified entries with reset options
  - Save/load functionality with JSON-based session storage
  - Multiple selection and batch operations

- **Production-Ready Export Options**
  - CSV export with NEW/UPDT modes for production systems
  - Individual and batch XML generation
  - ZIP compression for multiple XML exports
  - Standardized template downloads
  - Filtered export support (exports search results when active)

- **Advanced User Experience**
  - Real-time search with result filtering
  - Visual editing indicators with blue highlighting
  - Edit status persistence across save/load sessions
  - One-click reset of editing indicators
  - Responsive design for mobile and desktop use

## New Features

### Search Functionality
- **ISBN Search**: Find entries by exact or partial ISBN match
- **Real-time Filtering**: Table updates instantly as you type
- **Search Info Display**: Shows current filter status and result count
- **Export Integration**: CSV exports respect active search filters

### Enhanced Editing System
- **Universal Edit Capability**: Edit any entry whether manually added or imported from Excel
- **Visual Edit Tracking**: Modified entries display with blue background and "EDITED" badge
- **Edit Status Persistence**: Editing indicators are preserved when saving/loading workspaces
- **Reset Edit Status**: One-click button to clear all visual indicators while preserving data changes
- **Smart Button Visibility**: Reset button appears automatically when edited entries exist

### Improved Workflow
- **Post-Import Editing**: Full editing capabilities for all imported Excel data
- **Session Management**: Complete state preservation including edit history
- **Enhanced Validation**: Comprehensive error checking with visual feedback
- **Batch Operations**: Improved support for multiple entry operations

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
    mechanical_70: { name: 'Enso 70 gsm', grammage: 70, volume: 20 },
    holmen_bulky_52: { name: 'Holmen Bulky 52 gsm', grammage: 52, volume: 22 },
    holmen_book_55: { name: 'Holmen Book 55 gsm', grammage: 55, volume: 19.6 },
    holmen_cream_65: { name: 'Holmen Cream 65 gsm', grammage: 65, volume: 21.2 },
    holmen_book_52: { name: 'Holmen Book 52 gsm', grammage: 52, volume: 15.6 }
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

### Search Implementation
- **Real-time Filtering**: Case-insensitive ISBN matching
- **Performance Optimized**: Efficient filtering for large datasets
- **State Management**: Search state preserved across operations
- **Export Integration**: Filtered results properly exported

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
├── style.css           # Custom styling with enhanced visual indicators
├── script.js           # Application logic with search and edit tracking
├── favicon-32x32.png   # Browser icon
├── apple-touch-icon.png # iOS icon
├── item_templates.xlsm  # Excel template
├── User_Guide.pdf      # PDF user documentation
├── README.md           # This documentation
└── USER-INSTRUCTIONS.md # Detailed user guide
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

### Enhanced Entry Management
- Comprehensive form with real-time validation
- Automated spine size calculation
- Support for up to two plate sections
- Intelligent page extent adjustment
- **NEW**: Complete post-import editing capabilities
- **NEW**: Visual tracking of modified entries

### Advanced Search & Filter
- **NEW**: Real-time ISBN search with partial matching
- **NEW**: Instant table filtering with result counts
- **NEW**: Search-aware export functionality
- **NEW**: Clear search with one click

### Bulk Data Management
- Excel import with validation
- Error highlighting for invalid cells
- Batch operations for multiple entries
- Delete all functionality
- **NEW**: Full editing capabilities for imported data
- **NEW**: Visual indicators for modified imported entries

### Export Options
- CSV generation with NEW/UPDT modes
- Single XML download
- Batch XML download with ZIP
- Save/load work sessions with edit history preservation
- **NEW**: Filtered export support
- **NEW**: Edit status persistence in saved sessions

### Enhanced Data Validation
- Real-time field validation
- Error highlighting and messaging
- Automated corrections where possible
- ISBN checksum verification
- **NEW**: Comprehensive post-import validation
- **NEW**: Visual feedback for validation errors

### Session Management
- **NEW**: Complete workspace state preservation
- **NEW**: Edit history tracking across sessions
- **NEW**: One-click edit status reset
- **NEW**: Smart UI state management

## Usage Workflow

1. **Import or Add Data**: Use Excel import or manual entry
2. **Search & Filter**: Use ISBN search to locate specific entries
3. **Edit as Needed**: Modify any entry with full validation
4. **Visual Tracking**: See edited entries highlighted in blue
5. **Export Results**: Generate CSV/XML with current filter applied
6. **Save Session**: Preserve all data and edit history
7. **Reset When Done**: Clear edit indicators while keeping changes

This enhanced version provides a complete solution for POD specification management with professional-grade features for data tracking, search, and workflow management.