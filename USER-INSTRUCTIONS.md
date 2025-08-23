# POD Item Template Manager - User Guide

This guide provides detailed instructions for using the POD Item Template Manager application to create, manage, and export book specifications for print-on-demand production.

## Application Overview

The POD Item Template Manager helps you:
- Create and validate book specifications
- Calculate spine sizes automatically
- Manage plate sections
- Import data from Excel with full editing capabilities
- Search and filter entries by ISBN
- Track editing history with visual indicators
- Export to CSV and XML formats
- Save and reload complete work sessions

## Getting Started

### Interface Layout
- **Header Bar**: Contains application title and control buttons
- **Input Form**: Fields for entering book specifications
- **Search Bar**: Real-time ISBN search with clear button
- **Data Table**: Displays all entries with action buttons and visual indicators
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
   - Lamination (Gloss, Matt, or No Lamination)
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

### Enhanced Search & Filter Functionality

#### ISBN Search
1. **Basic Search**: Type an ISBN in the "Search by ISBN" field
2. **Real-time Results**: Table filters instantly as you type
3. **Partial Matching**: Find entries with partial ISBN matches
4. **Search Info**: View current filter status and result counts
5. **Clear Search**: Click the X button or clear the field to show all entries

#### Search Features
- **Case-insensitive**: Search works regardless of capitalization
- **Instant Updates**: No need to press Enter or click search
- **Export Integration**: CSV exports will include only filtered results when search is active
- **Persistent State**: Search is maintained across editing operations

### Importing from Excel with Enhanced Editing

#### Preparing Your Data

1. Download the template by clicking "Download Template" link
2. Fill in your data following the column structure
3. Save your Excel file

#### Importing Data

1. Click "browse" or drag and drop your Excel file onto the import zone
2. The system will validate all entries and import them
3. A summary message will show successful and failed imports
4. Invalid entries will be highlighted in the table with pink cells
5. **NEW**: All imported data is immediately editable

#### Post-Import Editing
- **Full Edit Capability**: Click the pencil icon on any imported entry to edit
- **Complete Validation**: All fields are validated when editing imported data
- **Visual Tracking**: Edited entries are highlighted with blue background
- **Edit Persistence**: Visual indicators are preserved when saving/loading work

#### Import Validation Rules

- All required fields must be present
- ISBN must be valid 13-digit format
- Page extent will adjust automatically to divisible values
- Titles over 58 characters will be truncated
- Plate section data must be in the format: "Insert after p[PAGE]-[NUMBER]pp-[PAPER TYPE]"

### Managing Entries with Visual Tracking

#### Table Operations

- **Delete Entry**: Click trash icon to remove an individual entry
- **Edit Entry**: Click pencil icon to modify any entry (manual or imported)
- **Download XML**: Click code icon to generate XML for a single entry
- **Select Entries**: Use checkboxes to select one or more entries
- **Select All**: Use the checkbox in the table header to select all entries

#### Visual Indicators

- **Blue Highlighting**: Edited entries show light blue background
- **"EDITED" Badge**: Small badge appears on modified entries
- **Left Border**: Blue left border indicates edited status
- **Pink Highlighting**: Invalid fields show pink background

#### Edit Status Management

- **Automatic Tracking**: System automatically marks entries as edited when modified
- **Status Persistence**: Edit indicators are preserved when saving/loading workspaces
- **Reset Option**: "Reset Edited Status" button appears when edited entries exist
- **Clean Slate**: Reset removes visual indicators while preserving data changes

#### Batch Operations

- **Delete All**: Removes all entries from the table (confirmation required)
- **Download Selected XML**: Generates XML files for all selected entries
  - For a single selection: Downloads individual XML file
  - For multiple selections: Downloads ZIP file containing all XMLs
- **Reset All Edit Status**: Remove visual indicators from all edited entries

### Enhanced Export Options

#### CSV Export

1. Choose mode using the toggle switch:
   - NEW: For new book entries
   - UPDT: For updating existing entries
2. Click "Generate CSV" button
3. **NEW**: If search is active, only filtered results will be exported
4. File will download automatically with timestamp in filename
5. Export includes current filter status in filename when applicable

#### XML Export

1. Select entries using checkboxes in the table
2. Click "Download XML" button
3. System will generate:
   - Individual XML file for single selection
   - ZIP file containing multiple XMLs for multiple selections
4. **NEW**: Works with filtered search results

#### XML Structure

The XML export includes:
- Basic book information (ISBN, title)
- Dimensions (trim height, width, spine size)
- Materials (paper type, binding style, lamination)
- Page extent
- Plate section details (if present)

### Enhanced Saving and Loading

#### Save Current Work

1. Click "Save" button in the header
2. Enter filename in the dialog (or use default)
3. Click "Save" in the dialog
4. **NEW**: JSON file includes edit history and visual indicators
5. File downloads to your computer

#### Load Previous Work

1. Click "Load" button in the header
2. Select previously saved JSON file
3. **NEW**: System restores all entries with edit indicators
4. **NEW**: "Reset Edited Status" button appears if edited entries exist

### Managing Edit History

#### Understanding Edit Indicators
- **Blue Background**: Entry has been modified since import/creation
- **"EDITED" Badge**: Small visual reminder of modification status
- **Status Persistence**: Indicators survive save/load cycles

#### Resetting Edit Status
1. **When Available**: "Reset Edited Status" button appears next to search info when edited entries exist
2. **How to Use**: Click button and confirm in dialog
3. **What It Does**: Removes all visual indicators while preserving your data changes
4. **Result**: Clean table appearance with all your modifications intact

## Advanced Tips for Efficient Use

### Workflow Optimization

1. **Import First**: Use Excel import for bulk data entry
2. **Search & Edit**: Use ISBN search to locate and modify specific entries
3. **Track Changes**: Monitor blue highlighting to see what you've modified
4. **Export Filtered**: Use search to export subsets of your data
5. **Save Progress**: Regular saves preserve both data and edit history
6. **Reset When Done**: Clean up visual indicators once satisfied with changes

### Search Strategies

- **Exact Match**: Enter complete ISBN for single result
- **Partial Match**: Enter ISBN fragment to find related entries
- **Quick Filtering**: Use search to work with subsets of large datasets
- **Export Filtering**: Search before CSV export to get targeted data

### Edit Management

- **Visual Tracking**: Use blue highlighting to track your modifications
- **Batch Editing**: Use search to locate related entries for editing
- **Status Reset**: Clear visual indicators when ready for final export
- **History Preservation**: Save work to maintain complete edit history

### Data Entry Tips

- Enter trim width first to ensure proper page extent validation
- Use Excel import for multiple entries to save time
- Check for pink highlighting in the table to identify validation errors
- Save your work regularly using the Save button
- **NEW**: Use search to quickly locate entries that need editing
- **NEW**: Monitor blue highlighting to track your editing progress

### Special Features

- **Page Extent Adjustment**: The system will prompt you to adjust page extent to the nearest valid value based on trim width
- **Spine Size Calculation**: Updates automatically when you change page extent, paper type, or binding style
- **ISBN Validation**: Includes checksum verification to prevent errors
- **Plate Sections**: Use the toggle switches to show/hide plate section fields as needed
- **Real-time Search**: Find entries instantly without clicking search buttons
- **Edit Tracking**: Visual indicators help you track which entries you've modified

### Troubleshooting

- If an entry has validation errors, fields will highlight in pink
- Check the message banner at the top for error descriptions
- For Excel import issues, ensure your data matches the template format
- If spine size shows as 0, check that all required fields are filled correctly
- **NEW**: If search returns no results, check your ISBN spelling
- **NEW**: If the "Reset Edited Status" button doesn't appear, ensure you have actually edited some entries

## Reference

### Paper Types Available

- Amber Preprint 80 gsm
- Woodfree 80 gsm
- Munken Print Cream 70 gsm
- LetsGo Silk 90 gsm
- Matt 115 gsm
- Holmen Book Cream 60 gsm
- Enso 70 gsm
- Holmen Bulky 52 gsm
- Holmen Book 55 gsm
- Holmen Cream 65 gsm
- Holmen Book 52 gsm

### Binding Options

- Limp
- Cased (adds 4mm to spine size)

### Lamination Types

- Gloss
- Matt
- No Lamination

### New Interface Elements

- **Search by ISBN Field**: Real-time filtering input
- **Search Info Display**: Shows current filter status
- **Reset Edited Status Button**: Appears when edited entries exist
- **Visual Edit Indicators**: Blue highlighting and "EDITED" badges
- **Enhanced Export Options**: Filtered export support

This enhanced version provides comprehensive data management capabilities with professional-grade tracking and search features for efficient POD specification workflow.