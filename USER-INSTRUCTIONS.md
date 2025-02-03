# POD Item Template Manager - User Guide

## Getting Started

### Basic Navigation
- The interface shows a form for entering book specifications and a table displaying all entries
- Control buttons are located in the header:
  - Save/Load work
  - NEW/UPDT toggle for CSV generation
  - Generate CSV button
  - Download XML button

### Adding Single Entries

1. Fill in required fields:
   - ISBN (13 digits)
   - Title (max 58 characters)
   - Trim Height
   - Trim Width
   - Paper Type
   - Binding Style
   - Page Extent
   - Lamination

2. The spine size calculates automatically based on:
   - Page extent
   - Paper type
   - Binding style

3. Click "Add Entry" to add to the table

### Importing Excel Data

1. Obtain template:
   - Click "Download Template" link
   - Template includes required column headers

2. Import options:
   - Drag and drop Excel file onto import zone
   - Click "browse" to select file
   - System validates all entries

3. Import validation:
   - Invalid cells highlight in pink
   - Error message shows count of valid/invalid entries
   - Titles over 58 characters truncate automatically

### Managing Entries

#### Table Operations
- Delete individual rows using trash icon
- Download individual XML using code icon
- Select multiple rows using checkboxes
- Use "Select All" checkbox in header

#### Batch Operations
- Delete All: Removes all entries
- Download XML:
  - Single file for one selection
  - ZIP file for multiple selections

### Exporting Data

#### CSV Export
1. Select NEW/UPDT mode in header
2. Click "Generate CSV"
3. File downloads automatically

#### XML Export
1. Select entries using checkboxes
2. Click "Download XML"
3. System generates:
   - Single XML for one selection
   - ZIP file for multiple selections

### Saving Work

1. Click "Save" button
2. Enter filename
3. JSON file downloads with all entries

### Loading Previous Work

1. Click "Load" button
2. Select saved JSON file
3. System restores all entries

## Tips

- Page extent automatically adjusts to nearest valid number based on trim width
- Save work regularly
- Validate Excel data before importing
- Use batch XML download for multiple entries
- Check pink highlights for validation errors