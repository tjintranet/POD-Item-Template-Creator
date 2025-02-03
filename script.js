// Paper specifications
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
};

// Constants for validation
const NARROW_WIDTH_THRESHOLD = 156;
const SPINE_CALCULATION_FACTOR = 20000;
const HARDBACK_SPINE_ADDITION = 4;



// Function to show save dialog
function saveWork() {
    if (entries.length === 0) {
        showError('No entries to save');
        return;
    }

    // Generate default filename with timestamp
    const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '_')
        .replace('T', '_')
        .replace('Z', '');
    const defaultFilename = `pod_template_${timestamp}`;

    // Set default filename in input
    document.getElementById('saveFilename').value = defaultFilename;

    // Show the modal
    const saveModal = new bootstrap.Modal(document.getElementById('saveFileModal'));
    saveModal.show();
}

// Function to handle the actual file download
function downloadSaveFile() {
    try {
        // Get filename from input
        let filename = document.getElementById('saveFilename').value.trim();

        // Add .json extension if not present
        if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
        }

        // Replace any invalid characters
        filename = filename.replace(/[<>:"/\\|?*]/g, '_');

        // Create save data object
        const saveData = {
            entries: entries,
            timestamp: new Date().toISOString()
        };

        // Create and download file
        const blob = new Blob([JSON.stringify(saveData, null, 2)], {
            type: 'application/json'
        });

        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Hide modal first
            const saveModal = bootstrap.Modal.getInstance(document.getElementById('saveFileModal'));
            saveModal.hide();

            // Wait for modal to finish hiding before showing success message
            setTimeout(() => {
                showError('Work saved successfully!');
            }, 300); // Modal fade duration is typically 300ms
        }
    } catch (error) {
        console.error('Error saving work:', error);
        showError('Error saving work');
    }
}
// Create hidden file input (put this at the top with other initializations)
const loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.accept = '.json';
loadInput.style.display = 'none';
document.body.appendChild(loadInput);

// Function to trigger file selection
function loadWork() {
    loadInput.click();
}

// Add event listener for file loading (put this after loadInput creation)
loadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const saveData = JSON.parse(event.target.result);

            // Validate the loaded data
            if (!Array.isArray(saveData.entries)) {
                throw new Error('Invalid save file format');
            }

            // Clear existing entries and load saved ones
            entries = saveData.entries;
            updateTable(); // Update the table with loaded entries
            enableDownloadButton(); // Enable/disable download button based on entries
            showError('Work loaded successfully!');

            // Clear the file input for future use
            loadInput.value = '';
        } catch (error) {
            console.error('Error loading save file:', error);
            showError('Error loading save file: Invalid format');
            loadInput.value = '';
        }
    };

    reader.onerror = function() {
        showError('Error reading file');
        loadInput.value = '';
    };

    reader.readAsText(file);
});




// Calculate adjusted page extent
function calculatePageExtent(originalExtent, trimWidth) {
    const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
    return Math.ceil(originalExtent / divisor) * divisor;
}

// Validate page extent
function validatePageExtent() {
    const pageExtentInput = document.getElementById('pageExtent');
    const trimWidthInput = document.getElementById('trimWidth');

    const pageExtent = parseInt(pageExtentInput.value);
    const trimWidth = parseInt(trimWidthInput.value);

    if (!pageExtent || !trimWidth) return;

    const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;

    if (pageExtent % divisor !== 0) {
        const adjustedValue = calculatePageExtent(pageExtent, trimWidth);
        const message = `For trim width ${trimWidth}mm, page extent must be divisible by ${divisor}. 
                               Would you like to adjust ${pageExtent} to ${adjustedValue}?`;

        // Create modal for warning
        const modalHtml = `
                    <div class="modal fade" id="pageExtentModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Page Extent Warning</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <p>${message}</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Keep Current</button>
                                    <button type="button" class="btn btn-primary" onclick="adjustPageExtent(${adjustedValue})">
                                        Adjust to ${adjustedValue}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;

        // Remove existing modal if any
        const existingModal = document.getElementById('pageExtentModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to document
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('pageExtentModal'));
        modal.show();

        return false;
    }
    return true;
}

// Function to adjust page extent
function adjustPageExtent(newValue) {
    document.getElementById('pageExtent').value = newValue;
    const modal = bootstrap.Modal.getInstance(document.getElementById('pageExtentModal'));
    if (modal) {
        modal.hide();
    }
    updateSpineSize();
}

// Add event listeners for validation
document.getElementById('pageExtent').addEventListener('change', validatePageExtent);
document.getElementById('trimWidth').addEventListener('change', validatePageExtent);

function calculateSpineSize(pageExtent, paperType, bindingStyle) {
    const paperSpecs = PAPER_SPECS[paperType];
    if (!paperSpecs) return 0;

    const baseSpineThickness = Math.round(
        (pageExtent * paperSpecs.grammage * paperSpecs.volume) / SPINE_CALCULATION_FACTOR
    );

    return bindingStyle.toLowerCase() === 'cased' ?
        baseSpineThickness + HARDBACK_SPINE_ADDITION :
        baseSpineThickness;
}

// Auto-calculate page extent
document.getElementById('trimWidth').addEventListener('input', function() {
    const pageExtentInput = document.getElementById('pageExtent');
    const originalExtent = parseInt(pageExtentInput.value) || 0;
    if (originalExtent > 0) {
        const adjustedExtent = calculatePageExtent(originalExtent, parseInt(this.value) || 0);
        pageExtentInput.value = adjustedExtent;
        // Recalculate spine size if all necessary fields are filled
        updateSpineSize();
    }
});

// Update spine size when relevant fields change
function updateSpineSize() {
    const pageExtent = parseInt(document.getElementById('pageExtent').value) || 0;
    const paperType = document.getElementById('paperType').value;
    const bindingStyle = document.getElementById('bindingStyle').value;

    if (pageExtent && paperType && bindingStyle) {
        const spineSize = calculateSpineSize(pageExtent, paperType, bindingStyle);
        document.getElementById('spineSize').value = spineSize;
    }
}
// Add event listeners for spine size calculation
['pageExtent', 'paperType', 'bindingStyle'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateSpineSize);
});

// Store entries
let entries = [];

// ISBN validation
function isValidISBN(isbn) {
    const cleaned = isbn.replace(/[-\s]/g, '');

    // Check length
    if (cleaned.length !== 13) {
        return {
            isValid: false,
            error: 'ISBN must be exactly 13 digits'
        };
    }

    // Check if all characters are digits
    if (!/^\d{13}$/.test(cleaned)) {
        return {
            isValid: false,
            error: 'ISBN must contain only digits'
        };
    }

    // Check prefix
    if (!cleaned.startsWith('978') && !cleaned.startsWith('979')) {
        return {
            isValid: false,
            error: 'ISBN must start with 978 or 979'
        };
    }

    // Check checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    if (checkDigit !== parseInt(cleaned[12])) {
        return {
            isValid: false,
            error: 'Invalid ISBN checksum'
        };
    }

    return {
        isValid: true,
        error: ''
    };
}

// Add real-time ISBN validation
document.getElementById('isbn').addEventListener('input', function() {
    const validation = isValidISBN(this.value);
    if (!validation.isValid) {
        this.classList.add('is-invalid');
        // Remove existing feedback if any
        const existingFeedback = document.getElementById('isbn-feedback');
        if (existingFeedback) existingFeedback.remove();

        // Add new feedback
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback d-block';
        feedback.id = 'isbn-feedback';
        feedback.textContent = validation.error;
        this.parentNode.appendChild(feedback);
    } else {
        this.classList.remove('is-invalid');
        const feedback = document.getElementById('isbn-feedback');
        if (feedback) feedback.remove();
    }
});

// Update title character counter with immediate validation
document.getElementById('title').addEventListener('input', function() {
    const counter = document.getElementById('titleCounter');
    const length = this.value.length;
    counter.textContent = `${length} / 58 characters`;

    if (length > 58) {
        counter.classList.add('text-danger');
        this.classList.add('is-invalid');
        // Remove existing feedback if any
        const existingFeedback = document.getElementById('title-feedback');
        if (existingFeedback) existingFeedback.remove();

        // Add new feedback
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback d-block';
        feedback.id = 'title-feedback';
        feedback.textContent = 'Title cannot exceed 58 characters';
        this.parentNode.appendChild(feedback);
    } else {
        counter.classList.remove('text-danger');
        this.classList.remove('is-invalid');
        const feedback = document.getElementById('title-feedback');
        if (feedback) feedback.remove();
    }
});

// Validate and highlight field
function validateField(id, condition, errorMessage) {
    const field = document.getElementById(id);
    if (!condition) {
        field.classList.add('is-invalid');
        if (!document.getElementById(`${id}-feedback`)) {
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.id = `${id}-feedback`;
            feedback.textContent = errorMessage;
            field.parentNode.appendChild(feedback);
        }
        return false;
    }
    field.classList.remove('is-invalid');
    const feedback = document.getElementById(`${id}-feedback`);
    if (feedback) feedback.remove();
    return true;
}

// Reset field validation
function resetFieldValidation(id) {
    const field = document.getElementById(id);
    field.classList.remove('is-invalid');
    const feedback = document.getElementById(`${id}-feedback`);
    if (feedback) feedback.remove();
}

// Add entry to table
function addEntry() {
    let isValid = true;

    // Validate ISBN
    const isbn = document.getElementById('isbn').value;
    const isbnValidation = isValidISBN(isbn);
    isValid = validateField('isbn', isbnValidation.isValid, isbnValidation.error) && isValid;

    // Validate Title
    const title = document.getElementById('title').value;
    isValid = validateField('title', title.length > 0 && title.length <= 58,
        title.length === 0 ? 'Title is required' : 'Title cannot exceed 58 characters') && isValid;

    // Validate other required fields
    const requiredFields = [{
            id: 'trimHeight',
            name: 'Trim Height'
        },
        {
            id: 'trimWidth',
            name: 'Trim Width'
        },
        {
            id: 'paperType',
            name: 'Paper Type'
        },
        {
            id: 'bindingStyle',
            name: 'Binding Style'
        },
        {
            id: 'pageExtent',
            name: 'Page Extent'
        },
        {
            id: 'lamination',
            name: 'Lamination'
        }
    ];

    requiredFields.forEach(field => {
        const value = document.getElementById(field.id).value;
        isValid = validateField(field.id, value.trim() !== '', `${field.name} is required`) && isValid;
    });

    if (!isValid) {
        showError('Please fill in all required fields correctly');
        return;
    }

    const paperTypeSelect = document.getElementById('paperType');
    const bindingStyleSelect = document.getElementById('bindingStyle');
    const laminationSelect = document.getElementById('lamination');

    const entry = {
        isbn: isbn,
        title: title,
        trimHeight: document.getElementById('trimHeight').value,
        trimWidth: document.getElementById('trimWidth').value,
        spineSize: document.getElementById('spineSize').value,
        paperType: paperTypeSelect.options[paperTypeSelect.selectedIndex].text,
        bindingStyle: bindingStyleSelect.options[bindingStyleSelect.selectedIndex].text,
        pageExtent: document.getElementById('pageExtent').value,
        lamination: laminationSelect.options[laminationSelect.selectedIndex].text
    };

    entries.push(entry);
    updateTable();
    resetForm();
    enableDownloadButton();
}

// Update table display
function updateTable() {
    const tbody = document.getElementById('entriesTableBody');
    tbody.innerHTML = '';

    entries.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="checkbox" class="form-check-input row-checkbox" data-index="${index}">
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
            <td>${entry.isbn}</td>
            <td>${entry.title}</td>
            <td>${entry.trimHeight}</td>
            <td>${entry.trimWidth}</td>
            <td>${entry.spineSize}</td>
            <td>${entry.paperType}</td>
            <td>${entry.bindingStyle}</td>
            <td>${entry.pageExtent}</td>
            <td>${entry.lamination}</td>
        `;
        tbody.appendChild(tr);
    });
    updateBatchButton();
}

// Handle select all checkbox
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
    updateBatchButton();
});

// Update batch download button state
function updateBatchButton() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    document.getElementById('batchXMLBtn').disabled = checkedBoxes.length === 0;
}

// Add event delegation for checkbox changes
document.getElementById('entriesTableBody').addEventListener('change', function(e) {
    if (e.target.classList.contains('row-checkbox')) {
        updateBatchButton();
        // Update "select all" checkbox
        const allCheckboxes = document.querySelectorAll('.row-checkbox');
        const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        document.getElementById('selectAll').checked = 
            allCheckboxes.length === checkedCheckboxes.length;
    }
});

// Helper function to escape XML special characters
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
}

// Function to download multiple XML files
async function downloadSelectedXML() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    if (checkedBoxes.length === 0) {
        showError('No rows selected');
        return;
    }

    // Create a zip file if multiple files are selected
    if (checkedBoxes.length > 1) {
        const zip = new JSZip();
        
        checkedBoxes.forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index);
            const entry = entries[index];
            const xmlContent = generateXMLContent(entry);
            zip.file(`book_${entry.isbn}.xml`, xmlContent);
        });

        // Generate and download zip file
        const zipBlob = await zip.generateAsync({type: 'blob'});
        const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
        downloadBlob(zipBlob, `pod_xml_batch_${timestamp}.zip`);
    } else {
        // If only one file, download it directly
        const index = parseInt(checkedBoxes[0].dataset.index);
        const entry = entries[index];
        const xmlContent = generateXMLContent(entry);
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        downloadBlob(blob, `book_${entry.isbn}.xml`);
    }
}

// Helper function to generate XML content
function generateXMLContent(entry) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<book>
    <isbn>${entry.isbn}</isbn>
    <title>${escapeXml(entry.title)}</title>
    <specifications>
        <trim>
            <height>${entry.trimHeight}</height>
            <width>${entry.trimWidth}</width>
        </trim>
        <spine>${entry.spineSize}</spine>
        <paper>${escapeXml(entry.paperType)}</paper>
        <binding>${entry.bindingStyle}</binding>
        <pageExtent>${entry.pageExtent}</pageExtent>
        <lamination>${entry.lamination}</lamination>
    </specifications>
</book>`;
}

// Helper function to download blob
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Delete entry
function deleteEntry(index) {
    entries.splice(index, 1);
    updateTable();
    enableDownloadButton();
}

// Reset form
function resetForm() {
    const fields = ['isbn', 'title', 'trimHeight', 'trimWidth', 'spineSize',
        'paperType', 'bindingStyle', 'pageExtent', 'lamination'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        element.value = '';
        resetFieldValidation(field);
    });

    document.getElementById('titleCounter').textContent = '0 / 58 characters';
}


// Show error/success message with auto-fade
function showError(message, duration = 4000) {
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');

    // Clear any existing timeouts
    if (window.errorTimeout) {
        clearTimeout(window.errorTimeout);
    }

    // Reset classes and show message
    error.classList.remove('d-none', 'fade-out');
    errorMessage.textContent = message;

    // Set timeout for fade out
    window.errorTimeout = setTimeout(() => {
        // Add fade-out class
        error.classList.add('fade-out');

        // Hide after fade animation completes
        setTimeout(() => {
            error.classList.add('d-none');
            error.classList.remove('fade-out');
        }, 1000);
    }, duration);
}


// Enable/disable download button
function enableDownloadButton() {
    document.getElementById('downloadBtn').disabled = entries.length === 0;
}

// Clear Form Button
function clearFields() {
    const fields = ['isbn', 'title', 'trimHeight', 'trimWidth', 'spineSize',
        'paperType', 'bindingStyle', 'pageExtent', 'lamination'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        element.value = '';
        element.classList.remove('is-invalid');
        const feedback = document.getElementById(`${field}-feedback`);
        if (feedback) feedback.remove();
    });

    document.getElementById('titleCounter').textContent = '0 / 58 characters';
}

// Handle file upload
document.getElementById('fileUpload').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellText: true
        });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: ''
        });

        // Clear existing entries
        entries = [];

        // Process each row
        jsonData.forEach(row => {
            const isbn = row['ISBN'] || '';
            if (!isbn || !isValidISBN(isbn)) {
                console.warn(`Skipping row with invalid ISBN: ${isbn}`);
                return;
            }

            // Parse numeric values
            const trimWidth = parseInt(row['Trim Width']) || 0;
            let pageExtent = parseInt(row['Page Extent']) || 0;
            const adjustedPageExtent = calculatePageExtent(pageExtent, trimWidth);

            // Get paper specs for spine calculation
            const paperType = row['Paper'];
            const paperTypeKey = Object.keys(PAPER_SPECS).find(key =>
                PAPER_SPECS[key].name === paperType
            );

            // Calculate spine size
            const spineSize = paperTypeKey ? calculateSpineSize(
                adjustedPageExtent,
                paperTypeKey,
                row['Binding'].toLowerCase()
            ) : 0;

            const entry = {
                isbn: isbn,
                title: row['Title'] || '',
                trimHeight: row['Trim Height'] || '',
                trimWidth: trimWidth.toString(),
                spineSize: spineSize.toString(),
                paperType: paperType || '',
                bindingStyle: row['Binding'] || '',
                pageExtent: adjustedPageExtent.toString(),
                lamination: row['Lamination'] || ''
            };

            if (entry.title.length <= 58) {
                entries.push(entry);
            } else {
                console.warn(`Skipping row with title exceeding 58 characters: ${entry.title}`);
            }
        });

        updateTable();
        enableDownloadButton();
        this.value = '';

        if (entries.length > 0) {
            showError(`Successfully imported ${entries.length} entries`);
        } else {
            showError('No valid entries found in the Excel file');
        }
    } catch (error) {
        console.error('Error processing Excel file:', error);
        showError('Error processing Excel file: ' + error.message);
    }
});

document.getElementById('updateToggle').addEventListener('change', function() {
    const label = document.getElementById('toggleLabel');
    label.textContent = this.checked ? 'UPDT' : 'NEW';
});

// Generate CSV function - placeholder for your specific format
function generateCSV() {
    if (entries.length === 0) {
        showError('No entries to export');
        return;
    }

    try {
        // Simply check if the toggle is checked
        const isChecked = document.getElementById('updateToggle').checked;
        const action = isChecked ? 'UPDT' : 'NEW';

        let csvRows = entries.map(entry => {
            // Get paper specs for grammage
            const paperTypeKey = Object.keys(PAPER_SPECS).find(key =>
                PAPER_SPECS[key].name === entry.paperType
            );
            const grammage = paperTypeKey ? PAPER_SPECS[paperTypeKey].grammage.toString() : '';

            // Format each row according to template format
            return [
                'ISBN', // Static 'ISBN'
                action, // NEW or UPDT based on toggle
                entry.isbn, // ISBN value
                entry.title, // Title
                entry.bindingStyle, // Binding style (Limp/Cased)
                entry.lamination, // Lamination (Gloss/Matt)
                entry.trimHeight, // Height (234)
                entry.trimWidth, // Width (156)
                entry.spineSize, // Spine size
                entry.pageExtent, // Page extent
                grammage, // Paper grammage from specs
                entry.paperType, // Paper type
                'N' // Static 'N'
            ].map(value => value.toString()).join(',');
        });

        // Create blob and trigger download
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;'
        });

        // Generate filename with timestamp
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '_') // Replace : and . with _
            .replace('T', '_') // Replace T with _
            .replace('Z', ''); // Remove Z

        const filename = `itemTemplate${timestamp}.csv`;

        // Create download link
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        console.error('Error generating CSV:', error);
        showError('Error generating CSV file');
    }
}