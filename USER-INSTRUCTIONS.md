# POD Item Template Manager - User Instructions

## Getting Started

### Interface Overview
The POD Item Template Manager is divided into three main sections:
1. Control Header - Contains save, load, and export options
2. Input Form - Where you enter book specifications
3. Data Table - Displays all entered items

## Basic Operations

### Adding a New Entry

1. **Fill in Required Fields:**
   - ISBN (13 digits)
   - Title (max 58 characters)
   - Trim Height
   - Trim Width
   - Paper Type
   - Binding Style
   - Page Extent
   - Lamination

2. **Field Guidelines:**
   * **ISBN:**
     - Must be 13 digits
     - Must start with 978 or 979
     - Will validate automatically
   
   * **Title:**
     - Maximum 58 characters
     - Character count displays automatically
   
   * **Page Extent:**
     - Will adjust automatically based on trim width
     - For trim width ≤ 156mm: Must be divisible by 6
     - For trim width > 156mm: Must be divisible by 4

3. **Click "Add Entry"** to add the item to your list

### Managing Entries

- **Clear Form:** Click "Clear Fields" to reset all input fields
- **Delete Entry:** Click the trash icon next to any entry in the table
- **Review Entries:** All entries are displayed in the table below the form

## Saving and Loading Work

### Saving Your Work
1. Click the "Save" button
2. Enter a filename in the dialog box
   - .json extension will be added automatically
   - Invalid characters will be replaced
3. Click "Save" to download the file
4. Your work will be saved as a JSON file to your downloads folder

### Loading Previous Work
1. Click the "Load" button
2. Select a previously saved JSON file
3. Your previous entries will be loaded into the table
4. You can continue adding or editing entries

## Generating CSV Output

### Setting Export Mode
1. Use the NEW/UPDT toggle in the header:
   - NEW: For new item templates
   - UPDT: For updating existing templates

### Exporting to CSV
1. Ensure you have at least one entry in the table
2. Select appropriate NEW/UPDT mode
3. Click "Generate CSV"
4. File will download with timestamp in the name

## Understanding Automatic Calculations

### Spine Size Calculation
Spine size is automatically calculated based on:
- Page extent
- Paper type specifications
- Binding style (additional 4mm for cased binding)

### Page Extent Adjustments
When entering page extent:
- For narrow books (≤156mm): Must be divisible by 6
- For wide books (>156mm): Must be divisible by 4
- System will offer to adjust to nearest valid number

## Paper Types Available

The following paper types are available for selection:
- Amber Preprint 80 gsm
- Woodfree 80 gsm
- Munken Print Cream 70 gsm
- LetsGo Silk 90 gsm
- Matt 115 gsm
- Holmen Book Cream 60 gsm
- Premium Mono 90 gsm
- Premium Colour 90 gsm
- Mechanical Creamy 70 gsm

## Binding Options

### Available Styles
- **Limp:** Standard paperback binding
- **Cased:** Hardback binding (adds 4mm to spine size)

## Troubleshooting

### Common Issues

1. **Invalid ISBN:**
   - Check all 13 digits are entered correctly
   - Verify it starts with 978 or 979
   - Ensure checksum digit is correct

2. **Page Extent Errors:**
   - Check divisibility rule based on trim width
   - Use suggested adjustment when offered

3. **Save/Load Issues:**
   - Ensure you have entries to save
   - Verify you're selecting a valid JSON file when loading
   - Check file permissions if download fails

4. **CSV Generation:**
   - Verify you have at least one entry
   - Check NEW/UPDT toggle is set correctly
   - Ensure you have write permissions in download folder

### Status Messages
- Status messages appear at the top of the form
- Messages will automatically fade after a few seconds
- Different colors indicate different message types:
  - Blue: Information
  - Green: Success
  - Red: Error

## Tips and Best Practices

1. **Regular Saving**
   - Save your work regularly
   - Use descriptive filenames
   - Keep backup copies of important templates

2. **Efficient Data Entry**
   - Enter similar items consecutively
   - Use clear naming conventions for files
   - Verify entries in the table before generating CSV

3. **File Management**
   - Organize saved templates in dedicated folders
   - Use date or version numbers in filenames
   - Keep backup copies of important templates

4. **CSV Generation**
   - Double-check NEW/UPDT mode before generating
   - Verify all entries are correct
   - Save your work before generating CSV

## Keyboard Shortcuts

- Tab: Move between form fields
- Enter: Submit form (when "Add Entry" is focused)
- Delete: Clear form (when "Clear Fields" is focused)