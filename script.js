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
        name: 'Enso 70 gsm',
        grammage: 70,
        volume: 20
    }
};

// Constants for validation
const NARROW_WIDTH_THRESHOLD = 156;
const SPINE_CALCULATION_FACTOR = 20000;
const HARDBACK_SPINE_ADDITION = 4;

// Function to toggle first plate section fields
function togglePlateSectionFields() {
    const hasPlateSection = document.getElementById('hasPlateSection').checked;
    const plateSectionFields = document.querySelectorAll('.plate-section-fields');
    
    plateSectionFields.forEach(field => {
        if (hasPlateSection) {
            field.classList.remove('d-none');
        } else {
            field.classList.add('d-none');
            // Clear values when hiding
            document.getElementById('plateInsertPage').value = '';
            document.getElementById('platePages').value = '';
            document.getElementById('platePaperType').value = '';
        }
    });
}

// Function to toggle second plate section fields
function toggleSecondPlateSectionFields() {
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection').checked;
    const secondPlateSectionFields = document.querySelectorAll('.second-plate-section-fields');
    
    secondPlateSectionFields.forEach(field => {
        if (hasSecondPlateSection) {
            field.classList.remove('d-none');
        } else {
            field.classList.add('d-none');
            // Clear values when hiding
            document.getElementById('secondPlateInsertPage').value = '';
            document.getElementById('secondPlatePages').value = '';
            document.getElementById('secondPlatePaperType').value = '';
        }
    });
}

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

// Function to validate first plate section fields
function validatePlateSectionFields() {
    const hasPlateSection = document.getElementById('hasPlateSection').checked;
    if (!hasPlateSection) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    // Validate plate insert page
    const plateInsertPage = document.getElementById('plateInsertPage').value;
    const isPlateInsertPageValid = plateInsertPage.trim() !== '' && parseInt(plateInsertPage) > 0;
    isValid = validateField('plateInsertPage', isPlateInsertPageValid,
        'Insert page is required and must be greater than 0') && isValid;
    if (!isPlateInsertPageValid) invalidFields.push('plateInsertPage');

    // Validate plate pages
    const platePages = document.getElementById('platePages').value;
    const isPlatePageValid = platePages.trim() !== '' && parseInt(platePages) > 0;
    isValid = validateField('platePages', isPlatePageValid,
        'Plate pages is required and must be greater than 0') && isValid;
    if (!isPlatePageValid) invalidFields.push('platePages');

    // Validate plate paper type
    const platePaperType = document.getElementById('platePaperType').value;
    const isPlatePaperTypeValid = platePaperType.trim() !== '';
    isValid = validateField('platePaperType', isPlatePaperTypeValid,
        'Plate paper type is required') && isValid;
    if (!isPlatePaperTypeValid) invalidFields.push('platePaperType');

    return { isValid, invalidFields };
}

// Function to validate second plate section fields
function validateSecondPlateSectionFields() {
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection').checked;
    if (!hasSecondPlateSection) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    // Validate second plate insert page
    const secondPlateInsertPage = document.getElementById('secondPlateInsertPage').value;
    const isSecondPlateInsertPageValid = secondPlateInsertPage.trim() !== '' && parseInt(secondPlateInsertPage) > 0;
    isValid = validateField('secondPlateInsertPage', isSecondPlateInsertPageValid,
        'Insert page is required and must be greater than 0') && isValid;
    if (!isSecondPlateInsertPageValid) invalidFields.push('secondPlateInsertPage');

    // Validate second plate pages
    const secondPlatePages = document.getElementById('secondPlatePages').value;
    const isSecondPlatePageValid = secondPlatePages.trim() !== '' && parseInt(secondPlatePages) > 0;
    isValid = validateField('secondPlatePages', isSecondPlatePageValid,
        'Plate pages is required and must be greater than 0') && isValid;
    if (!isSecondPlatePageValid) invalidFields.push('secondPlatePages');

    // Validate second plate paper type
    const secondPlatePaperType = document.getElementById('secondPlatePaperType').value;
    const isSecondPlatePaperTypeValid = secondPlatePaperType.trim() !== '';
    isValid = validateField('secondPlatePaperType', isSecondPlatePaperTypeValid,
        'Plate paper type is required') && isValid;
    if (!isSecondPlatePaperTypeValid) invalidFields.push('secondPlatePaperType');

    return { isValid, invalidFields };
}

function addEntry() {
    let isValid = true;
    const invalidFields = [];

    // Validate ISBN
    const isbn = document.getElementById('isbn').value;
    const isbnValidation = isValidISBN(isbn);
    isValid = validateField('isbn', isbnValidation.isValid, isbnValidation.error) && isValid;
    if (!isbnValidation.isValid) invalidFields.push('isbn');

    // Validate Title
    const title = document.getElementById('title').value;
    const isTitleValid = title.length > 0 && title.length <= 58;
    isValid = validateField('title', isTitleValid,
        title.length === 0 ? 'Title is required' : 'Title cannot exceed 58 characters') && isValid;
    if (!isTitleValid) invalidFields.push('title');

    // Validate other required fields
    const requiredFields = [
        { id: 'trimHeight', name: 'Trim Height' },
        { id: 'trimWidth', name: 'Trim Width' },
        { id: 'paperType', name: 'Paper Type' },
        { id: 'bindingStyle', name: 'Binding Style' },
        { id: 'pageExtent', name: 'Page Extent' },
        { id: 'lamination', name: 'Lamination' }
    ];

    requiredFields.forEach(field => {
        const value = document.getElementById(field.id).value;
        const isFieldValid = value.trim() !== '';
        isValid = validateField(field.id, isFieldValid, `${field.name} is required`) && isValid;
        if (!isFieldValid) invalidFields.push(field.id);
    });

    // Check if first plate section is enabled and validate those fields
    const hasPlateSection = document.getElementById('hasPlateSection').checked;
    let plateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (hasPlateSection) {
        plateSectionValidation = validatePlateSectionFields();
        isValid = isValid && plateSectionValidation.isValid;
        if (!plateSectionValidation.isValid) {
            invalidFields.push(...plateSectionValidation.invalidFields);
        }
    }
    
    // Check if second plate section is enabled and validate those fields
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection').checked;
    let secondPlateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (hasSecondPlateSection) {
        secondPlateSectionValidation = validateSecondPlateSectionFields();
        isValid = isValid && secondPlateSectionValidation.isValid;
        if (!secondPlateSectionValidation.isValid) {
            invalidFields.push(...secondPlateSectionValidation.invalidFields);
        }
    }

    if (!isValid) {
        showError('Please fill in all required fields correctly');
        return;
    }

    const paperTypeSelect = document.getElementById('paperType');
    const bindingStyleSelect = document.getElementById('bindingStyle');
    const laminationSelect = document.getElementById('lamination');
    
    // Get plate paper type values from selects
    let platePaperType = '';
    if (hasPlateSection) {
        const platePaperTypeSelect = document.getElementById('platePaperType');
        platePaperType = platePaperTypeSelect.options[platePaperTypeSelect.selectedIndex].text;
    }
    
    let secondPlatePaperType = '';
    if (hasSecondPlateSection) {
        const secondPlatePaperTypeSelect = document.getElementById('secondPlatePaperType');
        secondPlatePaperType = secondPlatePaperTypeSelect.options[secondPlatePaperTypeSelect.selectedIndex].text;
    }
    
    // Create entry object
    const entry = {
        isbn: isbn,
        title: title,
        trimHeight: document.getElementById('trimHeight').value,
        trimWidth: document.getElementById('trimWidth').value,
        spineSize: document.getElementById('spineSize').value,
        paperType: paperTypeSelect.options[paperTypeSelect.selectedIndex].text,
        bindingStyle: bindingStyleSelect.options[bindingStyleSelect.selectedIndex].text,
        pageExtent: document.getElementById('pageExtent').value,
        lamination: laminationSelect.options[laminationSelect.selectedIndex].text,
        
        // First plate section
        hasPlateSection: hasPlateSection,
        plateInsertPage: hasPlateSection ? document.getElementById('plateInsertPage').value : '',
        platePages: hasPlateSection ? document.getElementById('platePages').value : '',
        platePaperType: platePaperType,
        
        // Second plate section
        hasSecondPlateSection: hasSecondPlateSection,
        secondPlateInsertPage: hasSecondPlateSection ? document.getElementById('secondPlateInsertPage').value : '',
        secondPlatePages: hasSecondPlateSection ? document.getElementById('secondPlatePages').value : '',
        secondPlatePaperType: secondPlatePaperType,
        
        invalidFields: invalidFields
    };

    entries.push(entry);
    updateTable();
    resetForm();
    enableDownloadButton();
}

function resetForm() {
    const fields = ['isbn', 'title', 'trimHeight', 'trimWidth', 'spineSize',
        'paperType', 'bindingStyle', 'pageExtent', 'lamination',
        'plateInsertPage', 'platePages', 'platePaperType',
        'secondPlateInsertPage', 'secondPlatePages', 'secondPlatePaperType'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = '';
            resetFieldValidation(field);
        }
    });

    // Reset first plate section checkbox and hide fields
    document.getElementById('hasPlateSection').checked = false;
    document.querySelectorAll('.plate-section-fields').forEach(field => {
        field.classList.add('d-none');
    });
    
    // Reset second plate section checkbox and hide fields
    document.getElementById('hasSecondPlateSection').checked = false;
    document.querySelectorAll('.second-plate-section-fields').forEach(field => {
        field.classList.add('d-none');
    });

    document.getElementById('titleCounter').textContent = '0 / 58 characters';
}

// Clear Form Button
function clearFields() {
    const fields = ['isbn', 'title', 'trimHeight', 'trimWidth', 'spineSize',
        'paperType', 'bindingStyle', 'pageExtent', 'lamination',
        'plateInsertPage', 'platePages', 'platePaperType',
        'secondPlateInsertPage', 'secondPlatePages', 'secondPlatePaperType'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = '';
            element.classList.remove('is-invalid');
            const feedback = document.getElementById(`${field}-feedback`);
            if (feedback) feedback.remove();
        }
    });

    // Reset first plate section checkbox and hide fields
    document.getElementById('hasPlateSection').checked = false;
    document.querySelectorAll('.plate-section-fields').forEach(field => {
        field.classList.add('d-none');
    });
    
    // Reset second plate section checkbox and hide fields
    document.getElementById('hasSecondPlateSection').checked = false;
    document.querySelectorAll('.second-plate-section-fields').forEach(field => {
        field.classList.add('d-none');
    });

    document.getElementById('titleCounter').textContent = '0 / 58 characters';
}

function updateTable() {
    if (entries.some(entry => entry.hasOwnProperty('invalidFields'))) {
        updateTableWithValidation();
    } else {
        const tbody = document.getElementById('entriesTableBody');
        tbody.innerHTML = '';
        entries.forEach((entry, index) => {
            const tr = document.createElement('tr');
            
            // Create plate section text
            let plateSectionText = '';
            if (entry.hasPlateSection) {
                plateSectionText = `Insert after p${entry.plateInsertPage}-${entry.platePages}pp-${entry.platePaperType}`;
            }
            
            // Create second plate section text
            let secondPlateSectionText = '';
            if (entry.hasSecondPlateSection) {
                secondPlateSectionText = `Insert after p${entry.secondPlateInsertPage}-${entry.secondPlatePages}pp-${entry.secondPlatePaperType}`;
            }
            
            tr.innerHTML = `
                <td class="text-center">
                    <input type="checkbox" class="form-check-input entry-select" data-index="${index}">
                </td>
                <td class="text-nowrap">
                    <button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-primary btn-sm ms-1" onclick="downloadXML(${index})">
                        <i class="bi bi-file-earmark-code"></i>
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
                <td>${plateSectionText}</td>
                <td>${secondPlateSectionText}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function updateTableWithValidation() {
    const tbody = document.getElementById('entriesTableBody');
    tbody.innerHTML = '';
    
    entries.forEach((entry, index) => {
        const tr = document.createElement('tr');
        
        // Create first plate section text
        let plateSectionText = '';
        if (entry.hasPlateSection) {
            plateSectionText = `Insert after p${entry.plateInsertPage}-${entry.platePages}pp-${entry.platePaperType}`;
        }
        
        // Create second plate section text
        let secondPlateSectionText = '';
        if (entry.hasSecondPlateSection) {
            secondPlateSectionText = `Insert after p${entry.secondPlateInsertPage}-${entry.secondPlatePages}pp-${entry.secondPlatePaperType}`;
        }
        
        tr.innerHTML = `
            <td class="text-center">
                <input type="checkbox" class="form-check-input entry-select" data-index="${index}">
            </td>
            <td class="text-nowrap">
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-primary btn-sm ms-1" onclick="downloadXML(${index})">
                    <i class="bi bi-file-earmark-code"></i>
                </button>
            </td>
            <td class="${entry.invalidFields?.includes('isbn') ? 'invalid-cell' : ''}">${entry.isbn}</td>
            <td class="${entry.invalidFields?.includes('title') ? 'invalid-cell' : ''}">${entry.title}</td>
            <td class="${entry.invalidFields?.includes('trimHeight') ? 'invalid-cell' : ''}">${entry.trimHeight}</td>
            <td class="${entry.invalidFields?.includes('trimWidth') ? 'invalid-cell' : ''}">${entry.trimWidth}</td>
            <td>${entry.spineSize}</td>
            <td class="${entry.invalidFields?.includes('paperType') ? 'invalid-cell' : ''}">${entry.paperType}</td>
            <td class="${entry.invalidFields?.includes('bindingStyle') ? 'invalid-cell' : ''}">${entry.bindingStyle}</td>
            <td class="${entry.invalidFields?.includes('pageExtent') ? 'invalid-cell' : ''}">${entry.pageExtent}</td>
            <td class="${entry.invalidFields?.includes('lamination') ? 'invalid-cell' : ''}">${entry.lamination}</td>
            <td class="${entry.hasPlateSection && (entry.invalidFields?.includes('plateInsertPage') || entry.invalidFields?.includes('platePages') || entry.invalidFields?.includes('platePaperType')) ? 'invalid-cell' : ''}">${plateSectionText}</td>
            <td class="${entry.hasSecondPlateSection && (entry.invalidFields?.includes('secondPlateInsertPage') || entry.invalidFields?.includes('secondPlatePages') || entry.invalidFields?.includes('secondPlatePaperType')) ? 'invalid-cell' : ''}">${secondPlateSectionText}</td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeXML(str) {
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function generateXML(entry) {
    // Create first plate section XML if present
    const plateSectionXML = entry.hasPlateSection ? `
        <plate_section>
            <insert_after_page>${escapeXML(entry.plateInsertPage)}</insert_after_page>
            <plate_pages>${escapeXML(entry.platePages)}</plate_pages>
            <plate_paper_type>${escapeXML(entry.platePaperType)}</plate_paper_type>
        </plate_section>` : '';
        
    // Create second plate section XML if present
    const secondPlateSectionXML = entry.hasSecondPlateSection ? `
        <second_plate_section>
            <insert_after_page>${escapeXML(entry.secondPlateInsertPage)}</insert_after_page>
            <plate_pages>${escapeXML(entry.secondPlatePages)}</plate_pages>
            <plate_paper_type>${escapeXML(entry.secondPlatePaperType)}</plate_paper_type>
        </second_plate_section>` : '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<book>
    <basic_info>
        <isbn>${escapeXML(entry.isbn)}</isbn>
        <title>${escapeXML(entry.title)}</title>
    </basic_info>
    <specifications>
        <dimensions>
            <trim_height>${escapeXML(entry.trimHeight)}</trim_height>
            <trim_width>${escapeXML(entry.trimWidth)}</trim_width>
            <spine_size>${escapeXML(entry.spineSize)}</spine_size>
        </dimensions>
        <materials>
            <paper_type>${escapeXML(entry.paperType)}</paper_type>
            <binding_style>${escapeXML(entry.bindingStyle)}</binding_style>
            <lamination>${escapeXML(entry.lamination)}</lamination>
        </materials>
        <page_extent>${escapeXML(entry.pageExtent)}</page_extent>${plateSectionXML}${secondPlateSectionXML}
    </specifications>
</book>`;
    return xml;
}

function downloadXML(index) {
    const entry = entries[index];
    const xml = generateXML(entry);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entry.isbn.replace(/[^0-9]/g, '')}_book.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadSelectedXML() {
    const selectedIndexes = Array.from(document.querySelectorAll('.entry-select:checked'))
        .map(checkbox => parseInt(checkbox.dataset.index));
    
    if (selectedIndexes.length === 0) {
        showError('No entries selected');
        return;
    }
    
    if (selectedIndexes.length === 1) {
        downloadXML(selectedIndexes[0]);
        return;
    }
    
    // Multiple files - create ZIP
    const zip = new JSZip();
    selectedIndexes.forEach(index => {
        const entry = entries[index];
        const xml = generateXML(entry);
        zip.file(`${entry.isbn.replace(/[^0-9]/g, '')}_book.xml`, xml);
    });
    
    zip.generateAsync({ type: 'blob' })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'metadata.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
}

document.addEventListener('change', function(e) {
    if (e.target.classList.contains('entry-select')) {
        const checkedBoxes = document.querySelectorAll('.entry-select:checked').length;
        document.getElementById('downloadXMLBtn').disabled = checkedBoxes === 0;
    }
});

// Delete entry
function deleteEntry(index) {
    entries.splice(index, 1);
    updateTable();
    enableDownloadButton();
}

document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.entry-select');
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
    document.getElementById('downloadXMLBtn').disabled = !this.checked;
});

// Dropzone event listeners
const dropzone = document.getElementById('dropzone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropzone.classList.add('dragover');
}

function unhighlight(e) {
    dropzone.classList.remove('dragover');
}

dropzone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// File input event listener
document.getElementById('fileUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        processExcelFile(file);
        this.value = ''; // Reset file input
    }
});

// File handling functions
function handleFiles(files) {
    if (files.length > 0) {
        processExcelFile(files[0]);
    }
}

async function processExcelFile(file) {
    if (!file.name.match(/\.(xls|xlsx|xlsm)$/i)) {
        showError('Please upload an Excel file (.xls or .xlsx or .xlsm)');
        return;
    }

    try {
        const buffer = await readFileAsArrayBuffer(file);
        const workbook = XLSX.read(new Uint8Array(buffer), {
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

        validateAndImportData(jsonData);
    } catch (error) {
        console.error('Error processing Excel file:', error);
        showError('Error processing Excel file');
    }
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

function validateAndImportData(jsonData) {
    entries = [];
    let validCount = 0;
    let invalidCount = 0;

    const validPaperTypes = Array.from(document.getElementById('paperType').options).map(opt => opt.text);
    const validBindingStyles = Array.from(document.getElementById('bindingStyle').options).map(opt => opt.text);
    const validLaminations = Array.from(document.getElementById('lamination').options).map(opt => opt.text);
    const validPlatePaperTypes = Array.from(document.getElementById('platePaperType').options).map(opt => opt.text);

    jsonData.forEach((row) => {
        const trimWidth = parseInt(row['Trim Width']) || 0;
        const pageExtent = parseInt(row['Page Extent']) || 0;
        const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
        const adjustedPageExtent = Math.ceil(pageExtent / divisor) * divisor;
        
        const paperTypeKey = Object.keys(PAPER_SPECS).find(key => 
            PAPER_SPECS[key].name === row['Paper Type']
        );

        let title = row['Title'] || '';
        const invalidFields = [];
        
        if (title.length > 58) {
            title = title.substring(0, 58);
            invalidFields.push('title');
        }

        // Process first plate section data - column 14 in the expected format "Insert after p144-8pp-Art Paper"
        let hasPlateSection = false;
        let plateInsertPage = '';
        let platePages = '';
        let platePaperType = '';
        
        const plateSectionText = row['Plate Section 1'] || '';
        if (plateSectionText) {
            hasPlateSection = true;
            
            // Parse the plate section text using regex
            const platePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
            const matches = plateSectionText.match(platePattern);
            
            if (matches && matches.length >= 4) {
                plateInsertPage = matches[1];
                platePages = matches[2];
                platePaperType = matches[3];
            } else {
                invalidFields.push('plateInsertPage', 'platePages', 'platePaperType');
            }
        }
        
        // Process second plate section data - column 15
        let hasSecondPlateSection = false;
        let secondPlateInsertPage = '';
        let secondPlatePages = '';
        let secondPlatePaperType = '';
        
        const secondPlateSectionText = row['Plate Section 2'] || '';
        if (secondPlateSectionText) {
            hasSecondPlateSection = true;
            
            // Parse the second plate section text using regex
            const secondPlatePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
            const secondMatches = secondPlateSectionText.match(secondPlatePattern);
            
            if (secondMatches && secondMatches.length >= 4) {
                secondPlateInsertPage = secondMatches[1];
                secondPlatePages = secondMatches[2];
                secondPlatePaperType = secondMatches[3];
            } else {
                invalidFields.push('secondPlateInsertPage', 'secondPlatePages', 'secondPlatePaperType');
            }
        }

        const entry = {
            isbn: row['ISBN'] || '',
            title: title,
            trimHeight: row['Trim Height'] || '',
            trimWidth: trimWidth.toString(),
            paperType: row['Paper Type'] || '',
            bindingStyle: row['Binding Style'] || '',
            pageExtent: adjustedPageExtent.toString(),
            spineSize: '',
            lamination: row['Lamination'] || '',
            
            // First plate section
            hasPlateSection: hasPlateSection,
            plateInsertPage: plateInsertPage,
            platePages: platePages,
            platePaperType: platePaperType,
            
            // Second plate section
            hasSecondPlateSection: hasSecondPlateSection,
            secondPlateInsertPage: secondPlateInsertPage,
            secondPlatePages: secondPlatePages,
            secondPlatePaperType: secondPlatePaperType,
            
            invalidFields: invalidFields
        };

        if (paperTypeKey && entry.bindingStyle) {
            entry.spineSize = calculateSpineSize(
                adjustedPageExtent,
                paperTypeKey,
                entry.bindingStyle
            ).toString();
        }

        if (!isValidISBN(entry.isbn).isValid) invalidFields.push('isbn');
        if (!validPaperTypes.includes(entry.paperType)) invalidFields.push('paperType');
        if (!validBindingStyles.includes(entry.bindingStyle)) invalidFields.push('bindingStyle');
        if (!validLaminations.includes(entry.lamination)) invalidFields.push('lamination');
        if (isNaN(entry.trimHeight) || entry.trimHeight <= 0) invalidFields.push('trimHeight');
        if (isNaN(entry.trimWidth) || entry.trimWidth <= 0) invalidFields.push('trimWidth');
        if (isNaN(entry.pageExtent) || entry.pageExtent <= 0) invalidFields.push('pageExtent');
        
        // Validate first plate section fields if present
        if (hasPlateSection) {
            if (!plateInsertPage || isNaN(plateInsertPage) || parseInt(plateInsertPage) <= 0) {
                invalidFields.push('plateInsertPage');
            }
            if (!platePages || isNaN(platePages) || parseInt(platePages) <= 0) {
                invalidFields.push('platePages');
            }
            if (!platePaperType || !validPlatePaperTypes.includes(platePaperType)) {
                invalidFields.push('platePaperType');
            }
        }
        
        // Validate second plate section fields if present
        if (hasSecondPlateSection) {
            if (!secondPlateInsertPage || isNaN(secondPlateInsertPage) || parseInt(secondPlateInsertPage) <= 0) {
                invalidFields.push('secondPlateInsertPage');
            }
            if (!secondPlatePages || isNaN(secondPlatePages) || parseInt(secondPlatePages) <= 0) {
                invalidFields.push('secondPlatePages');
            }
            if (!secondPlatePaperType || !validPlatePaperTypes.includes(secondPlatePaperType)) {
                invalidFields.push('secondPlatePaperType');
            }
        }

        invalidFields.length === 0 ? validCount++ : invalidCount++;
        entries.push(entry);
    });

    updateTableWithValidation();
    enableDownloadButton();
    document.getElementById('deleteAllBtn').disabled = entries.length === 0;

    const truncatedCount = entries.filter(e => e.invalidFields.includes('title')).length;
    const truncationMsg = truncatedCount > 0 ? ` (${truncatedCount} titles truncated to 58 characters)` : '';
    showError(`Imported ${validCount} valid and ${invalidCount} invalid entries${truncationMsg}`);
}

function deleteAllEntries() {
    if (confirm('Are you sure you want to delete all entries?')) {
        entries.length = 0;
        updateTableWithValidation();
        enableDownloadButton();
        document.getElementById('deleteAllBtn').disabled = true;
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('fileUpload').value = ''; // Reset file input
        showError('All entries deleted');
    }
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
    document.getElementById('deleteAllBtn').disabled = entries.length === 0;
}

// Generate CSV function
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

            // Format plate section data in the required format: "Insert after p144-8pp-Art Paper"
            let firstPlateSection = '';
            if (entry.hasPlateSection) {
                firstPlateSection = `Insert after p${entry.plateInsertPage}-${entry.platePages}pp-${entry.platePaperType}`;
            }
            
            // Format second plate section data
            let secondPlateSection = '';
            if (entry.hasSecondPlateSection) {
                secondPlateSection = `Insert after p${entry.secondPlateInsertPage}-${entry.secondPlatePages}pp-${entry.secondPlatePaperType}`;
            }

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
                'N', // Static 'N'
                firstPlateSection, // Column 14: First plate section
                secondPlateSection  // Column 15: Second plate section
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
            if (!isbn || !isValidISBN(isbn).isValid) {
                console.warn(`Skipping row with invalid ISBN: ${isbn}`);
                return;
            }

            // Parse numeric values
            const trimWidth = parseInt(row['Trim Width']) || 0;
            const pageExtent = parseInt(row['Page Extent']) || 0;
            const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
            const adjustedPageExtent = Math.ceil(pageExtent / divisor) * divisor;
            
            // Get paper type value from dropdown text
            const paperTypeKey = Object.keys(PAPER_SPECS).find(key => 
                PAPER_SPECS[key].name === row['Paper Type']
            );
            
            // Calculate spine size
            const spineSize = paperTypeKey && row['Binding Style'] ? 
                calculateSpineSize(adjustedPageExtent, paperTypeKey, row['Binding Style']).toString() : '';

            let title = row['Title'] || '';
            const invalidFields = [];
            let truncatedTitles = 0;
            
            if (title.length > 58) {
                title = title.substring(0, 58);
                invalidFields.push('title');
                truncatedTitles++;
            }

            // Process first plate section data
            let hasPlateSection = false;
            let plateInsertPage = '';
            let platePages = '';
            let platePaperType = '';
            
            const plateSectionText = row['Plate Section 1'] || '';
            if (plateSectionText) {
                hasPlateSection = true;
                
                // Parse the plate section text using regex
                const platePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
                const matches = plateSectionText.match(platePattern);
                
                if (matches && matches.length >= 4) {
                    plateInsertPage = matches[1];
                    platePages = matches[2];
                    platePaperType = matches[3];
                } else {
                    invalidFields.push('plateInsertPage', 'platePages', 'platePaperType');
                }
            }
            
            // Process second plate section data
            let hasSecondPlateSection = false;
            let secondPlateInsertPage = '';
            let secondPlatePages = '';
            let secondPlatePaperType = '';
            
            const secondPlateSectionText = row['Plate Section 2'] || '';
            if (secondPlateSectionText) {
                hasSecondPlateSection = true;
                
                // Parse the second plate section text using regex
                const secondPlatePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
                const secondMatches = secondPlateSectionText.match(secondPlatePattern);
                
                if (secondMatches && secondMatches.length >= 4) {
                    secondPlateInsertPage = secondMatches[1];
                    secondPlatePages = secondMatches[2];
                    secondPlatePaperType = secondMatches[3];
                } else {
                    invalidFields.push('secondPlateInsertPage', 'secondPlatePages', 'secondPlatePaperType');
                }
            }

            const entry = {
                isbn: row['ISBN'] || '',
                title: title,
                trimHeight: row['Trim Height'] || '',
                trimWidth: trimWidth.toString(),
                paperType: row['Paper Type'] || '',
                bindingStyle: row['Binding Style'] || '',
                pageExtent: adjustedPageExtent.toString(),
                spineSize: spineSize,
                lamination: row['Lamination'] || '',
                
                // First plate section
                hasPlateSection: hasPlateSection,
                plateInsertPage: plateInsertPage,
                platePages: platePages,
                platePaperType: platePaperType,
                
                // Second plate section
                hasSecondPlateSection: hasSecondPlateSection,
                secondPlateInsertPage: secondPlateInsertPage,
                secondPlatePages: secondPlatePages,
                secondPlatePaperType: secondPlatePaperType,
                
                invalidFields: invalidFields
            };

            entries.push(entry);
        });

        updateTable();
        enableDownloadButton();
        document.getElementById('deleteAllBtn').disabled = entries.length === 0;
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