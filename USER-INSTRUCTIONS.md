# POD Item Template Manager - User Guide

This guide provides detailed instructions for using the POD Item Template Manager application to create, manage, and export book specifications for print-on-demand production.

## Application Overview

The POD Item Template Manager helps you:
- Create and validate book specifications
- Calculate spine sizes automatically
- Manage plate sections
- Import data from Excel
- Export to CSV and XML formats
- Save and reload your work sessions

## Getting Started

### Interface Layout
- **Header Bar**: Contains application title and control buttons
- **Input Form**: Fields for entering book specifications
- **Data Table**: Displays all entries with action buttons
- **Import Section**: Area for uploading Excel files

### Adding Book Specifications

#### Required Information
1. **ISBN** (13 digits with valid checksum)
2. **Title** (maximum 58 characters)
3. **Book Dimensions**:
   - Trim Height (mm)
   - Trim Width (mm)
   - Page Extent
4. **Materials**:
   - Paper Type (select from dropdown)
   - Binding Style (Limp or Cased)
   - Lamination (Gloss or Matt)
5. **Optional Plate Sections**:
   - Toggle switches to enable plate sections
   - Insert page location
   - Number of plate pages
   - Plate paper type

#### Adding a Single Entry

1. Fill in all required fields in the form
2. The spine size will calculate automatically
3. Enable plate sections if needed and fill in details
4. Click "Add Entry" to add to the table
5. If validation errors occur, fields will highlight and show error messages

#### Automated Calculations

- **Spine Size**: Calculated based on page extent, paper type, and binding style
- **Page Extent Adjustment**: 
  - For trim width ≤ 156mm, page extent must be divisible by 6
  - For trim width > 156mm, page extent must be divisible by 4
  - The system will prompt you to adjust to the nearest valid value

#### Special Features

- **Plate Sections**: You can add up to two plate sections with custom insertion points
- **Real-time Validation**: The system validates inputs as you type
- **Title Counter**: Shows character count and warns if exceeding 58 characters

### Importing from Excel

#### Preparing Your Data

1. Download the template by clicking "Download Template" link
2. Fill in your data following the column structure
3. Save your Excel file

#### Importing Data

1. Click "browse" or drag and drop your Excel file onto the import zone
2. The system will validate all entries and import them
3. A summary message will show successful and failed imports
4. Invalid entries will be highlighted in the table with pink cells

#### Import Validation Rules

- All required fields must be present
- ISBN must be valid 13-digit format
- Page extent will adjust automatically to divisible values
- Titles over 58 characters will be truncated
- Plate section data must be in the format: "Insert after p[PAGE]-[NUMBER]pp-[PAPER TYPE]"

### Managing Entries

#### Table Operations

- **Delete Entry**: Click trash icon to remove an individual entry
- **Download XML**: Click code icon to generate XML for a single entry
- **Select Entries**: Use checkboxes to select one or more entries
- **Select All**: Use the checkbox in the table header to select all entries

#### Batch Operations

- **Delete All**: Removes all entries from the table (confirmation required)
- **Download Selected XML**: Generates XML files for all selected entries
  - For a single selection: Downloads individual XML file
  - For multiple selections: Downloads ZIP file containing all XMLs

### Exporting Data

#### CSV Export

1. Choose mode using the toggle switch:
   - NEW: For new book entries
   - UPDT: For updating existing entries
2. Click "Generate CSV" button
3. File will download automatically with timestamp in filename

#### XML Export

1. Select entries using checkboxes in the table
2. Click "Download XML" button
3. System will generate:
   - Individual XML file for single selection
   - ZIP file containing multiple XMLs for multiple selections

#### XML Structure

The XML export includes:
- Basic book information (ISBN, title)
- Dimensions (trim height, width, spine size)
- Materials (paper type, binding style, lamination)
- Page extent
- Plate section details (if present)

### Saving and Loading Work

#### Save Current Work

1. Click "Save" button in the header
2. Enter filename in the dialog (or use default)
3. Click "Save" in the dialog
4. JSON file will download to your computer

#### Load Previous Work

1. Click "Load" button in the header
2. Select previously saved JSON file
3. System will restore all entries to the table

## Tips for Efficient Use

### Data Entry Tips

- Enter trim width first to ensure proper page extent validation
- Use Excel import for multiple entries to save time
- Check for pink highlighting in the table to identify validation errors
- Save your work regularly using the Save button

### Special Features

- **Page Extent Adjustment**: The system will prompt you to adjust page extent to the nearest valid value based on trim width
- **Spine Size Calculation**: Updates automatically when you change page extent, paper type, or binding style
- **ISBN Validation**: Includes checksum verification to prevent errors
- **Plate Sections**: Use the toggle switches to show/hide plate section fields as needed

### Troubleshooting

- If an entry has validation errors, fields will highlight in pink
- Check the message banner at the top for error descriptions
- For Excel import issues, ensure your data matches the template format
- If spine size shows as 0, check that all required fields are filled correctly

## Reference

### Paper Types Available

- Amber Preprint 80 gsm
- Woodfree 80 gsm
- Munken Print Cream 70 gsm
- LetsGo Silk 90 gsm
- Matt 115 gsm
- Holmen Book Cream 60 gsm
- Premium Mono 90 gsm
- Premium Colour 90 gsm
- Enso 70 gsm

### Binding Options

- Limp
- Cased (adds 4mm to spine size)

### Lamination Types

- Gloss
- Matt