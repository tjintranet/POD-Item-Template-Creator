# POD Item Template Manager

A web-based application for managing Print-on-Demand (POD) item templates. This tool helps users create and manage book specifications with automated calculations for spine size and page extent validation.

## Features

### 1. ISBN Management
- Supports ISBN-13 format with automatic validation
- Real-time validation with detailed error messages
- Checks for valid prefix (978/979) and checksum

### 2. Title Management
- Supports titles up to 58 characters
- Real-time character count display
- Input validation with visual feedback

### 3. Book Specifications
- **Trim Size Management**
  - Height and width input
  - Automatic validation of measurements
  - Support for standard book dimensions

- **Page Extent Calculation**
  - Automatic adjustment based on trim width
  - Divisibility rules:
    - For trim width ≤ 156mm: Must be divisible by 6
    - For trim width > 156mm: Must be divisible by 4
  - Interactive adjustment suggestions

- **Spine Size Calculation**
  - Automatic calculation based on:
    - Page extent
    - Paper type
    - Binding style
  - Additional 4mm for hardback (cased) binding

### 4. Paper Type Options
- Amber Preprint 80 gsm
- Woodfree 80 gsm
- Munken Print Cream 70 gsm
- LetsGo Silk 90 gsm
- Matt 115 gsm
- Holmen Book Cream 60 gsm
- Premium Mono 90 gsm
- Premium Colour 90 gsm
- Mechanical Creamy 70 gsm

### 5. Additional Specifications
- Binding Style (Limp/Cased)
- Lamination Options (Gloss/Matt)
- Automated spine size calculation

### 6. Data Management
- Add multiple entries
- View all entries in a tabular format
- Delete individual entries
- Clear form functionality
- Input validation for all fields

### 7. Export Functionality
- Generate standardized CSV output
- Support for NEW/UPDT toggle for export type
- Automatically formatted filename with timestamp
- Standardized CSV format compatible with POD systems

## Usage

1. **Adding a New Entry**
   - Fill in all required fields
   - System validates inputs automatically
   - Click "Add Entry" to add to the table
   - Invalid entries will be highlighted with error messages

2. **Managing Entries**
   - View all entries in the table below the form
   - Delete individual entries using the trash icon
   - Clear the form using the "Clear Fields" button

3. **Generating CSV**
   - Toggle between NEW and UPDT modes
   - Click "Generate CSV" to export all entries
   - File downloads automatically with timestamp in filename

4. **Page Extent Rules**
   - The system automatically validates and suggests corrections for page extent
   - Follows divisibility rules based on trim width
   - Provides interactive modal for accepting suggested adjustments

## Technical Specifications

### Paper Specifications
Each paper type includes:
- Name
- Grammage (GSM)
- Volume factor for spine calculation

### Spine Size Calculation
Calculated using the formula:
```
(Page Extent × Paper Grammage × Paper Volume) / 20000
```
With an additional 4mm for cased binding.

## Error Handling

The application includes comprehensive error handling for:
- Invalid ISBN formats
- Title length violations
- Missing required fields
- Invalid page extent values
- Paper specification mismatches

## Browser Compatibility

The application is built using modern web technologies and requires:
- Modern web browser with JavaScript enabled
- Support for File API
- Support for Blob and URL.createObjectURL

## Dependencies

- Bootstrap 5.3.2
- Bootstrap Icons 1.11.3
- SheetJS (XLSX) 0.18.5
