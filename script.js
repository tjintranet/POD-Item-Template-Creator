// Paper specifications
const PAPER_SPECS = {
    // Standard POD Papers
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
    munken_80: {
        name: 'Munken Print Cream 80 gsm',
        grammage: 80,
        volume: 17.5
    },
    navigator_80: {
        name: 'Navigator 80 gsm',
        grammage: 80,
        volume: 12.5
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
        name: 'Ulverscroft Book Cream 60 gsm',
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
    },
    // Clays POD Papers
    holmen_bulky_52: {
        name: 'HolmenBulky 52 gsm',
        grammage: 52,
        volume: 22
    },
    holmen_book_55: {
        name: 'HolmenBook 55 gsm',
        grammage: 55,
        volume: 19.6
    },
    holmen_cream_65: {
        name: 'HolmenCream 65 gsm',
        grammage: 65,
        volume: 21.2
    },
    holmen_book_52: {
        name: 'HolmenBook 52 gsm',
        grammage: 52,
        volume: 15.6
    },
    // CUP POD Papers
    navigator_80: {
        name: 'Navigator 80 gsm',
        grammage: 80,
        volume: 13
    },
    munken_pure_80: {
        name: 'CUP MunkenPure 80 gsm',
        grammage: 80,
        volume: 13
    },
    clairjet_90: {
        name: 'Clairjet 90 gsm',
        grammage: 90,
        volume: 10
    },
    magno_matt_90: {
        name: 'Magno 90 gsm',
        grammage: 90,
        volume: 10
    },
};

// Constants for validation
const NARROW_WIDTH_THRESHOLD = 156;
const SPINE_CALCULATION_FACTOR = 20000;
const HARDBACK_SPINE_ADDITION = 4;

// Global variables
let currentEditingIndex = -1;
let entries = [];
let searchFilter = '';
let currentPage = 1;
let itemsPerPage = 100;

// Function to remove commas from strings to prevent CSV corruption
function removeCommasFromString(str) {
    if (typeof str === 'string') {
        return str.replace(/,/g, '');
    }
    return str;
}

// Function to clean all string fields in an object to remove commas
function cleanStringFieldsForCSV(obj) {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            cleanedObj[key] = removeCommasFromString(value);
        } else {
            cleanedObj[key] = value;
        }
    }
    return cleanedObj;
}

// Search functionality
function searchByISBN() {
    const searchTerm = document.getElementById('searchISBN').value.trim();
    searchFilter = searchTerm;
    currentPage = 1;
    updateTable();
}

function clearSearch() {
    document.getElementById('searchISBN').value = '';
    searchFilter = '';
    currentPage = 1;
    updateTable();
}

// Get filtered entries
function getFilteredEntries() {
    let filteredEntries = [...entries];
    if (searchFilter) {
        filteredEntries = filteredEntries.filter(entry => 
            entry.isbn && entry.isbn.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }
    return filteredEntries;
}

// Update search info
function updateSearchInfo() {
    const searchInfo = document.getElementById('searchInfo');
    if (!searchInfo) return;
    
    const filteredEntries = getFilteredEntries();
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredEntries.length);
    
    let message = '';
    if (searchFilter) {
        if (filteredEntries.length > 0) {
            message = `Showing ${startIndex}-${endIndex} of ${filteredEntries.length} matching entries (${entries.length} total)`;
        } else {
            message = `No entries found matching "${searchFilter}" (${entries.length} total)`;
        }
    } else {
        if (entries.length > 0) {
            message = `Showing ${startIndex}-${endIndex} of ${entries.length} entries`;
        } else {
            message = '';
        }
    }
    
    searchInfo.textContent = message;
}

// Pagination functions
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav aria-label="Table pagination"><ul class="pagination pagination-sm justify-content-center">';
    
    // Previous button
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <button class="page-link" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    </li>`;
    
    // Page numbers
    const pages = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (!pages.includes(i)) pages.push(i);
        }
        
        if (currentPage < totalPages - 2) pages.push('...');
        if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    pages.forEach(page => {
        if (page === '...') {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        } else {
            paginationHTML += `<li class="page-item ${currentPage === page ? 'active' : ''}">
                <button class="page-link" onclick="changePage(${page})">${page}</button>
            </li>`;
        }
    });
    
    // Next button
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <button class="page-link" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    </li>`;
    
    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(newPage) {
    const filteredEntries = getFilteredEntries();
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    
    if (newPage < 1 || newPage > totalPages) return;
    
    currentPage = newPage;
    updateTable();
}

// Function to toggle first plate section fields
function togglePlateSectionFields() {
    const hasPlateSection = document.getElementById('hasPlateSection').checked;
    const plateSectionFields = document.querySelectorAll('.plate-section-fields');
    
    plateSectionFields.forEach(field => {
        if (hasPlateSection) {
            field.classList.remove('d-none');
        } else {
            field.classList.add('d-none');
            const plateInsertPage = document.getElementById('plateInsertPage');
            const platePages = document.getElementById('platePages');
            const platePaperType = document.getElementById('platePaperType');
            
            if (plateInsertPage) plateInsertPage.value = '';
            if (platePages) platePages.value = '';
            if (platePaperType) platePaperType.value = '';
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
            const secondPlateInsertPage = document.getElementById('secondPlateInsertPage');
            const secondPlatePages = document.getElementById('secondPlatePages');
            const secondPlatePaperType = document.getElementById('secondPlatePaperType');
            
            if (secondPlateInsertPage) secondPlateInsertPage.value = '';
            if (secondPlatePages) secondPlatePages.value = '';
            if (secondPlatePaperType) secondPlatePaperType.value = '';
        }
    });
}

// Function to toggle edit modal first plate section fields
function toggleEditPlateSectionFields() {
    const hasPlateSection = document.getElementById('editHasPlateSection').checked;
    const plateSectionFields = document.querySelectorAll('.edit-plate-section-fields');
    
    plateSectionFields.forEach(field => {
        if (hasPlateSection) {
            field.classList.remove('d-none');
        } else {
            field.classList.add('d-none');
            const editPlateInsertPage = document.getElementById('editPlateInsertPage');
            const editPlatePages = document.getElementById('editPlatePages');
            const editPlatePaperType = document.getElementById('editPlatePaperType');
            
            if (editPlateInsertPage) editPlateInsertPage.value = '';
            if (editPlatePages) editPlatePages.value = '';
            if (editPlatePaperType) editPlatePaperType.value = '';
        }
    });
}

// Function to toggle edit modal second plate section fields
function toggleEditSecondPlateSectionFields() {
    const hasSecondPlateSection = document.getElementById('editHasSecondPlateSection').checked;
    const secondPlateSectionFields = document.querySelectorAll('.edit-second-plate-section-fields');
    
    secondPlateSectionFields.forEach(field => {
        if (hasSecondPlateSection) {
            field.classList.remove('d-none');
        } else {
            field.classList.add('d-none');
            const editSecondPlateInsertPage = document.getElementById('editSecondPlateInsertPage');
            const editSecondPlatePages = document.getElementById('editSecondPlatePages');
            const editSecondPlatePaperType = document.getElementById('editSecondPlatePaperType');
            
            if (editSecondPlateInsertPage) editSecondPlateInsertPage.value = '';
            if (editSecondPlatePages) editSecondPlatePages.value = '';
            if (editSecondPlatePaperType) editSecondPlatePaperType.value = '';
        }
    });
}

// Function to show save dialog
function saveWork() {
    if (entries.length === 0) {
        showError('No entries to save');
        return;
    }

    const timestamp = new Date().toISOString()
        .replace(/[:.]/g, '_')
        .replace('T', '_')
        .replace('Z', '');
    const defaultFilename = `pod_template_${timestamp}`;

    const saveFilenameElement = document.getElementById('saveFilename');
    if (saveFilenameElement) {
        saveFilenameElement.value = defaultFilename;
    }

    const saveModal = new bootstrap.Modal(document.getElementById('saveFileModal'));
    saveModal.show();
}

// Function to handle the actual file download
function downloadSaveFile() {
    try {
        const saveFilenameElement = document.getElementById('saveFilename');
        if (!saveFilenameElement) return;
        
        let filename = saveFilenameElement.value.trim();

        if (!filename.toLowerCase().endsWith('.json')) {
            filename += '.json';
        }

        filename = filename.replace(/[<>:"/\\|?*]/g, '_');

        const saveData = {
            entries: entries.map(entry => ({
                ...entry,
                isEdited: entry.isEdited === true
            })),
            timestamp: new Date().toISOString()
        };

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

            const saveModal = bootstrap.Modal.getInstance(document.getElementById('saveFileModal'));
            if (saveModal) {
                saveModal.hide();
            }

            setTimeout(() => {
                showError('Work saved successfully!');
            }, 300);
        }
    } catch (error) {
        console.error('Error saving work:', error);
        showError('Error saving work');
    }
}

// Create hidden file input
const loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.accept = '.json';
loadInput.style.display = 'none';
document.body.appendChild(loadInput);

// Function to trigger file selection
function loadWork() {
    loadInput.click();
}

// Add event listener for file loading
loadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const saveData = JSON.parse(event.target.result);

            if (!Array.isArray(saveData.entries)) {
                throw new Error('Invalid save file format');
            }

            entries = saveData.entries.map(entry => {
                return {
                    ...entry,
                    isEdited: entry.hasOwnProperty('isEdited') ? Boolean(entry.isEdited) : false
                };
            });
            
            currentPage = 1;
            updateTable();
            updateButtonStates();
            showError('Work loaded successfully!');

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

    if (!pageExtentInput || !trimWidthInput) return;

    const pageExtent = parseInt(pageExtentInput.value);
    const trimWidth = parseInt(trimWidthInput.value);

    if (!pageExtent || !trimWidth) return;

    const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;

    if (pageExtent % divisor !== 0) {
        const adjustedValue = calculatePageExtent(pageExtent, trimWidth);
        const message = `For trim width ${trimWidth}mm, page extent must be divisible by ${divisor}. Would you like to adjust ${pageExtent} to ${adjustedValue}?`;

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

        const existingModal = document.getElementById('pageExtentModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = new bootstrap.Modal(document.getElementById('pageExtentModal'));
        modal.show();

        return false;
    }
    return true;
}

// Function to adjust page extent
function adjustPageExtent(newValue) {
    const pageExtentElement = document.getElementById('pageExtent');
    if (pageExtentElement) {
        pageExtentElement.value = newValue;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('pageExtentModal'));
    if (modal) {
        modal.hide();
    }
    updateSpineSize();
}

// Validate page extent for edit modal
function validateEditPageExtent() {
    const pageExtentInput = document.getElementById('editPageExtent');
    const trimWidthInput = document.getElementById('editTrimWidth');

    if (!pageExtentInput || !trimWidthInput) return;

    const pageExtent = parseInt(pageExtentInput.value);
    const trimWidth = parseInt(trimWidthInput.value);

    if (!pageExtent || !trimWidth) return;

    const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;

    if (pageExtent % divisor !== 0) {
        const adjustedValue = calculatePageExtent(pageExtent, trimWidth);
        const message = `For trim width ${trimWidth}mm, page extent must be divisible by ${divisor}. Would you like to adjust ${pageExtent} to ${adjustedValue}?`;

        const modalHtml = `
            <div class="modal fade" id="editPageExtentModal" tabindex="-1">
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
                            <button type="button" class="btn btn-primary" onclick="adjustEditPageExtent(${adjustedValue})">
                                Adjust to ${adjustedValue}
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

        const existingModal = document.getElementById('editPageExtentModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = new bootstrap.Modal(document.getElementById('editPageExtentModal'));
        modal.show();

        return false;
    }
    return true;
}

// Function to adjust page extent in edit modal
function adjustEditPageExtent(newValue) {
    const pageExtentElement = document.getElementById('editPageExtent');
    if (pageExtentElement) {
        pageExtentElement.value = newValue;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPageExtentModal'));
    if (modal) {
        modal.hide();
    }
    updateEditSpineSize();
}

// Add event listeners for validation
document.addEventListener('DOMContentLoaded', function() {
    const pageExtentElement = document.getElementById('pageExtent');
    const trimWidthElement = document.getElementById('trimWidth');
    
    if (pageExtentElement) {
        pageExtentElement.addEventListener('change', validatePageExtent);
    }
    if (trimWidthElement) {
        trimWidthElement.addEventListener('change', validatePageExtent);
    }

    // Add validation for edit modal fields
    const editPageExtentElement = document.getElementById('editPageExtent');
    const editTrimWidthElement = document.getElementById('editTrimWidth');
    
    if (editPageExtentElement) {
        editPageExtentElement.addEventListener('change', validateEditPageExtent);
    }
    if (editTrimWidthElement) {
        editTrimWidthElement.addEventListener('change', validateEditPageExtent);
    }
});

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

// Auto-calculate page extent for edit modal
document.addEventListener('DOMContentLoaded', function() {
    const trimWidthElement = document.getElementById('trimWidth');
    if (trimWidthElement) {
        trimWidthElement.addEventListener('input', function() {
            const pageExtentInput = document.getElementById('pageExtent');
            if (!pageExtentInput) return;
            
            const originalExtent = parseInt(pageExtentInput.value) || 0;
            if (originalExtent > 0) {
                const adjustedExtent = calculatePageExtent(originalExtent, parseInt(this.value) || 0);
                pageExtentInput.value = adjustedExtent;
                updateSpineSize();
            }
        });
    }

    // Add event listener for real-time search
    const searchInput = document.getElementById('searchISBN');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                clearSearch();
            }
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchByISBN();
            }
        });
    }
});

// Validate and highlight field
function validateField(id, condition, errorMessage) {
    const field = document.getElementById(id);
    if (!field) return false;
    
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
    if (!field) return;
    
    field.classList.remove('is-invalid');
    const feedback = document.getElementById(`${id}-feedback`);
    if (feedback) feedback.remove();
}

// Function to validate first plate section fields
function validatePlateSectionFields() {
    const hasPlateSection = document.getElementById('hasPlateSection');
    if (!hasPlateSection || !hasPlateSection.checked) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    const plateInsertPage = document.getElementById('plateInsertPage');
    if (plateInsertPage) {
        const isPlateInsertPageValid = plateInsertPage.value.trim() !== '' && parseInt(plateInsertPage.value) > 0;
        isValid = validateField('plateInsertPage', isPlateInsertPageValid,
            'Insert page is required and must be greater than 0') && isValid;
        if (!isPlateInsertPageValid) invalidFields.push('plateInsertPage');
    }

    const platePages = document.getElementById('platePages');
    if (platePages) {
        const isPlatePageValid = platePages.value.trim() !== '' && parseInt(platePages.value) > 0;
        isValid = validateField('platePages', isPlatePageValid,
            'Plate pages is required and must be greater than 0') && isValid;
        if (!isPlatePageValid) invalidFields.push('platePages');
    }

    const platePaperType = document.getElementById('platePaperType');
    if (platePaperType) {
        const isPlatePaperTypeValid = platePaperType.value.trim() !== '';
        isValid = validateField('platePaperType', isPlatePaperTypeValid,
            'Plate paper type is required') && isValid;
        if (!isPlatePaperTypeValid) invalidFields.push('platePaperType');
    }

    return { isValid, invalidFields };
}

// Function to validate second plate section fields
function validateSecondPlateSectionFields() {
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection');
    if (!hasSecondPlateSection || !hasSecondPlateSection.checked) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    const secondPlateInsertPage = document.getElementById('secondPlateInsertPage');
    if (secondPlateInsertPage) {
        const isSecondPlateInsertPageValid = secondPlateInsertPage.value.trim() !== '' && parseInt(secondPlateInsertPage.value) > 0;
        isValid = validateField('secondPlateInsertPage', isSecondPlateInsertPageValid,
            'Insert page is required and must be greater than 0') && isValid;
        if (!isSecondPlateInsertPageValid) invalidFields.push('secondPlateInsertPage');
    }

    const secondPlatePages = document.getElementById('secondPlatePages');
    if (secondPlatePages) {
        const isSecondPlatePageValid = secondPlatePages.value.trim() !== '' && parseInt(secondPlatePages.value) > 0;
        isValid = validateField('secondPlatePages', isSecondPlatePageValid,
            'Plate pages is required and must be greater than 0') && isValid;
        if (!isSecondPlatePageValid) invalidFields.push('secondPlatePages');
    }

    const secondPlatePaperType = document.getElementById('secondPlatePaperType');
    if (secondPlatePaperType) {
        const isSecondPlatePaperTypeValid = secondPlatePaperType.value.trim() !== '';
        isValid = validateField('secondPlatePaperType', isSecondPlatePaperTypeValid,
            'Plate paper type is required') && isValid;
        if (!isSecondPlatePaperTypeValid) invalidFields.push('secondPlatePaperType');
    }

    return { isValid, invalidFields };
}

// Function to validate edit modal plate section fields
function validateEditPlateSectionFields() {
    const hasPlateSection = document.getElementById('editHasPlateSection');
    if (!hasPlateSection || !hasPlateSection.checked) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    const plateInsertPage = document.getElementById('editPlateInsertPage');
    if (plateInsertPage) {
        const isPlateInsertPageValid = plateInsertPage.value.trim() !== '' && parseInt(plateInsertPage.value) > 0;
        isValid = validateField('editPlateInsertPage', isPlateInsertPageValid,
            'Insert page is required and must be greater than 0') && isValid;
        if (!isPlateInsertPageValid) invalidFields.push('editPlateInsertPage');
    }

    const platePages = document.getElementById('editPlatePages');
    if (platePages) {
        const isPlatePageValid = platePages.value.trim() !== '' && parseInt(platePages.value) > 0;
        isValid = validateField('editPlatePages', isPlatePageValid,
            'Plate pages is required and must be greater than 0') && isValid;
        if (!isPlatePageValid) invalidFields.push('editPlatePages');
    }

    const platePaperType = document.getElementById('editPlatePaperType');
    if (platePaperType) {
        const isPlatePaperTypeValid = platePaperType.value.trim() !== '';
        isValid = validateField('editPlatePaperType', isPlatePaperTypeValid,
            'Plate paper type is required') && isValid;
        if (!isPlatePaperTypeValid) invalidFields.push('editPlatePaperType');
    }

    return { isValid, invalidFields };
}

// Function to validate edit modal second plate section fields
function validateEditSecondPlateSectionFields() {
    const hasSecondPlateSection = document.getElementById('editHasSecondPlateSection');
    if (!hasSecondPlateSection || !hasSecondPlateSection.checked) return { isValid: true, invalidFields: [] };

    let isValid = true;
    const invalidFields = [];

    const secondPlateInsertPage = document.getElementById('editSecondPlateInsertPage');
    if (secondPlateInsertPage) {
        const isSecondPlateInsertPageValid = secondPlateInsertPage.value.trim() !== '' && parseInt(secondPlateInsertPage.value) > 0;
        isValid = validateField('editSecondPlateInsertPage', isSecondPlateInsertPageValid,
            'Insert page is required and must be greater than 0') && isValid;
        if (!isSecondPlateInsertPageValid) invalidFields.push('editSecondPlateInsertPage');
    }

    const secondPlatePages = document.getElementById('editSecondPlatePages');
    if (secondPlatePages) {
        const isSecondPlatePageValid = secondPlatePages.value.trim() !== '' && parseInt(secondPlatePages.value) > 0;
        isValid = validateField('editSecondPlatePages', isSecondPlatePageValid,
            'Plate pages is required and must be greater than 0') && isValid;
        if (!isSecondPlatePageValid) invalidFields.push('editSecondPlatePages');
    }

    const secondPlatePaperType = document.getElementById('editSecondPlatePaperType');
    if (secondPlatePaperType) {
        const isSecondPlatePaperTypeValid = secondPlatePaperType.value.trim() !== '';
        isValid = validateField('editSecondPlatePaperType', isSecondPlatePaperTypeValid,
            'Plate paper type is required') && isValid;
        if (!isSecondPlatePaperTypeValid) invalidFields.push('editSecondPlatePaperType');
    }

    return { isValid, invalidFields };
}

function addEntry() {
    let isValid = true;
    const invalidFields = [];

    const isbnElement = document.getElementById('isbn');
    const isbn = isbnElement ? isbnElement.value : '';
    const isbnValidation = isValidISBN(isbn);
    isValid = validateField('isbn', isbnValidation.isValid, isbnValidation.error) && isValid;
    if (!isbnValidation.isValid) invalidFields.push('isbn');

    const titleElement = document.getElementById('title');
    const title = titleElement ? titleElement.value : '';
    const isTitleValid = title.length > 0 && title.length <= 58;
    isValid = validateField('title', isTitleValid,
        title.length === 0 ? 'Title is required' : 'Title cannot exceed 58 characters') && isValid;
    if (!isTitleValid) invalidFields.push('title');

    const requiredFields = [
        { id: 'trimHeight', name: 'Trim Height' },
        { id: 'trimWidth', name: 'Trim Width' },
        { id: 'paperType', name: 'Paper Type' },
        { id: 'bindingStyle', name: 'Binding Style' },
        { id: 'pageExtent', name: 'Page Extent' },
        { id: 'lamination', name: 'Lamination' }
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element ? element.value : '';
        const isFieldValid = value.trim() !== '';
        isValid = validateField(field.id, isFieldValid, `${field.name} is required`) && isValid;
        if (!isFieldValid) invalidFields.push(field.id);
    });

    const hasPlateSection = document.getElementById('hasPlateSection');
    let plateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (hasPlateSection && hasPlateSection.checked) {
        plateSectionValidation = validatePlateSectionFields();
        isValid = isValid && plateSectionValidation.isValid;
        if (!plateSectionValidation.isValid) {
            invalidFields.push(...plateSectionValidation.invalidFields);
        }
    }
    
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection');
    let secondPlateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (hasSecondPlateSection && hasSecondPlateSection.checked) {
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
    
    let platePaperType = '';
    if (hasPlateSection && hasPlateSection.checked) {
        const platePaperTypeSelect = document.getElementById('platePaperType');
        if (platePaperTypeSelect) {
            platePaperType = platePaperTypeSelect.options[platePaperTypeSelect.selectedIndex].text;
        }
    }
    
    let secondPlatePaperType = '';
    if (hasSecondPlateSection && hasSecondPlateSection.checked) {
        const secondPlatePaperTypeSelect = document.getElementById('secondPlatePaperType');
        if (secondPlatePaperTypeSelect) {
            secondPlatePaperType = secondPlatePaperTypeSelect.options[secondPlatePaperTypeSelect.selectedIndex].text;
        }
    }
    
    const entry = {
        isbn: removeCommasFromString(isbn),
        title: removeCommasFromString(title),
        trimHeight: document.getElementById('trimHeight') ? document.getElementById('trimHeight').value : '',
        trimWidth: document.getElementById('trimWidth') ? document.getElementById('trimWidth').value : '',
        spineSize: document.getElementById('spineSize') ? document.getElementById('spineSize').value : '',
        paperType: paperTypeSelect ? removeCommasFromString(paperTypeSelect.options[paperTypeSelect.selectedIndex].text) : '',
        bindingStyle: bindingStyleSelect ? removeCommasFromString(bindingStyleSelect.options[bindingStyleSelect.selectedIndex].text) : '',
        pageExtent: document.getElementById('pageExtent') ? document.getElementById('pageExtent').value : '',
        lamination: laminationSelect ? removeCommasFromString(laminationSelect.options[laminationSelect.selectedIndex].text) : '',
        hasPlateSection: hasPlateSection ? hasPlateSection.checked : false,
        plateInsertPage: (hasPlateSection && hasPlateSection.checked && document.getElementById('plateInsertPage')) ? document.getElementById('plateInsertPage').value : '',
        platePages: (hasPlateSection && hasPlateSection.checked && document.getElementById('platePages')) ? document.getElementById('platePages').value : '',
        platePaperType: removeCommasFromString(platePaperType),
        hasSecondPlateSection: hasSecondPlateSection ? hasSecondPlateSection.checked : false,
        secondPlateInsertPage: (hasSecondPlateSection && hasSecondPlateSection.checked && document.getElementById('secondPlateInsertPage')) ? document.getElementById('secondPlateInsertPage').value : '',
        secondPlatePages: (hasSecondPlateSection && hasSecondPlateSection.checked && document.getElementById('secondPlatePages')) ? document.getElementById('secondPlatePages').value : '',
        secondPlatePaperType: removeCommasFromString(secondPlatePaperType),
        isEdited: false,
        invalidFields: invalidFields
    };

    entries.push(entry);
    updateTable();
    resetForm();
    updateButtonStates();
    updateSearchInfo();
}

function editEntry(index) {
    currentEditingIndex = index;
    const entry = entries[index];
    
    const editISBN = document.getElementById('editISBN');
    const editTitle = document.getElementById('editTitle');
    const editTrimHeight = document.getElementById('editTrimHeight');
    const editTrimWidth = document.getElementById('editTrimWidth');
    const editPageExtent = document.getElementById('editPageExtent');
    const editSpineSize = document.getElementById('editSpineSize');
    const editLamination = document.getElementById('editLamination');
    const editPaperType = document.getElementById('editPaperType');
    const editBindingStyle = document.getElementById('editBindingStyle');
    
    if (editISBN) editISBN.value = entry.isbn;
    if (editTitle) editTitle.value = entry.title;
    if (editTrimHeight) editTrimHeight.value = entry.trimHeight;
    if (editTrimWidth) editTrimWidth.value = entry.trimWidth;
    if (editPageExtent) editPageExtent.value = entry.pageExtent;
    if (editSpineSize) editSpineSize.value = entry.spineSize;
    if (editLamination) editLamination.value = entry.lamination;
    
    if (editPaperType) {
        const paperTypeKey = Object.keys(PAPER_SPECS).find(key => 
            PAPER_SPECS[key].name === entry.paperType
        );
        if (paperTypeKey) {
            editPaperType.value = paperTypeKey;
        }
    }
    
    if (editBindingStyle) {
        editBindingStyle.value = entry.bindingStyle;
    }
    
    const editHasPlateSection = document.getElementById('editHasPlateSection');
    if (editHasPlateSection) {
        editHasPlateSection.checked = entry.hasPlateSection;
        if (entry.hasPlateSection) {
            const editPlateInsertPage = document.getElementById('editPlateInsertPage');
            const editPlatePages = document.getElementById('editPlatePages');
            const editPlatePaperType = document.getElementById('editPlatePaperType');
            
            if (editPlateInsertPage) editPlateInsertPage.value = entry.plateInsertPage;
            if (editPlatePages) editPlatePages.value = entry.platePages;
            if (editPlatePaperType) editPlatePaperType.value = entry.platePaperType;
            
            document.querySelectorAll('.edit-plate-section-fields').forEach(field => {
                field.classList.remove('d-none');
            });
        } else {
            document.querySelectorAll('.edit-plate-section-fields').forEach(field => {
                field.classList.add('d-none');
            });
        }
    }
    
    const editHasSecondPlateSection = document.getElementById('editHasSecondPlateSection');
    if (editHasSecondPlateSection) {
        editHasSecondPlateSection.checked = entry.hasSecondPlateSection;
        if (entry.hasSecondPlateSection) {
            const editSecondPlateInsertPage = document.getElementById('editSecondPlateInsertPage');
            const editSecondPlatePages = document.getElementById('editSecondPlatePages');
            const editSecondPlatePaperType = document.getElementById('editSecondPlatePaperType');
            
            if (editSecondPlateInsertPage) editSecondPlateInsertPage.value = entry.secondPlateInsertPage;
            if (editSecondPlatePages) editSecondPlatePages.value = entry.secondPlatePages;
            if (editSecondPlatePaperType) editSecondPlatePaperType.value = entry.secondPlatePaperType;
            
            document.querySelectorAll('.edit-second-plate-section-fields').forEach(field => {
                field.classList.remove('d-none');
            });
        } else {
            document.querySelectorAll('.edit-second-plate-section-fields').forEach(field => {
                field.classList.add('d-none');
            });
        }
    }
    
    const titleLength = entry.title.length;
    const editTitleCounter = document.getElementById('editTitleCounter');
    if (editTitleCounter) {
        editTitleCounter.textContent = `${titleLength} / 58 characters`;
    }
    
    const editFields = ['editISBN', 'editTitle', 'editTrimHeight', 'editTrimWidth', 'editPaperType', 
                       'editBindingStyle', 'editPageExtent', 'editLamination', 'editPlateInsertPage', 
                       'editPlatePages', 'editPlatePaperType', 'editSecondPlateInsertPage', 
                       'editSecondPlatePages', 'editSecondPlatePaperType'];
    
    editFields.forEach(fieldId => {
        resetFieldValidation(fieldId);
    });
    
    const editEntryModal = document.getElementById('editEntryModal');
    if (editEntryModal && typeof bootstrap !== 'undefined') {
        const editModal = new bootstrap.Modal(editEntryModal);
        editModal.show();
        
        // After modal is shown, trigger page extent validation if needed
        setTimeout(() => {
            if (editPageExtent && editTrimWidth) {
                const pageExtent = parseInt(editPageExtent.value);
                const trimWidth = parseInt(editTrimWidth.value);
                if (pageExtent && trimWidth) {
                    const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
                    if (pageExtent % divisor !== 0) {
                        // Show warning for non-compliant page extent
                        const adjustedValue = calculatePageExtent(pageExtent, trimWidth);
                        console.log(`Warning: Page extent ${pageExtent} should be adjusted to ${adjustedValue} for trim width ${trimWidth}mm`);
                        
                        // Optionally auto-correct or just highlight the issue
                        if (editPageExtent) {
                            editPageExtent.style.backgroundColor = '#fff3cd'; // Light yellow warning
                            editPageExtent.title = `Should be ${adjustedValue} for optimal printing`;
                        }
                    }
                }
            }
        }, 100);
    }
}

function saveEditedEntry() {
    if (currentEditingIndex === -1) return;
    
    let isValid = true;
    const invalidFields = [];

    const editISBN = document.getElementById('editISBN');
    const isbn = editISBN ? editISBN.value : '';
    const isbnValidation = isValidISBN(isbn);
    isValid = validateField('editISBN', isbnValidation.isValid, isbnValidation.error) && isValid;
    if (!isbnValidation.isValid) invalidFields.push('editISBN');

    const editTitle = document.getElementById('editTitle');
    const title = editTitle ? editTitle.value : '';
    const isTitleValid = title.length > 0 && title.length <= 58;
    isValid = validateField('editTitle', isTitleValid,
        title.length === 0 ? 'Title is required' : 'Title cannot exceed 58 characters') && isValid;
    if (!isTitleValid) invalidFields.push('editTitle');

    const requiredFields = [
        { id: 'editTrimHeight', name: 'Trim Height' },
        { id: 'editTrimWidth', name: 'Trim Width' },
        { id: 'editPaperType', name: 'Paper Type' },
        { id: 'editBindingStyle', name: 'Binding Style' },
        { id: 'editPageExtent', name: 'Page Extent' },
        { id: 'editLamination', name: 'Lamination' }
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element ? element.value : '';
        const isFieldValid = value.trim() !== '';
        isValid = validateField(field.id, isFieldValid, `${field.name} is required`) && isValid;
        if (!isFieldValid) invalidFields.push(field.id);
    });

    // Validate and auto-correct page extent before saving
    const editPageExtent = document.getElementById('editPageExtent');
    const editTrimWidth = document.getElementById('editTrimWidth');
    
    if (editPageExtent && editTrimWidth) {
        const pageExtent = parseInt(editPageExtent.value);
        const trimWidth = parseInt(editTrimWidth.value);
        
        if (pageExtent && trimWidth) {
            const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
            if (pageExtent % divisor !== 0) {
                // Auto-correct the page extent
                const adjustedValue = calculatePageExtent(pageExtent, trimWidth);
                editPageExtent.value = adjustedValue;
                
                // Update spine size after page extent correction
                updateEditSpineSize();
                
                console.log(`Auto-corrected page extent from ${pageExtent} to ${adjustedValue}`);
            }
        }
    }

    const editHasPlateSection = document.getElementById('editHasPlateSection');
    let plateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (editHasPlateSection && editHasPlateSection.checked) {
        plateSectionValidation = validateEditPlateSectionFields();
        isValid = isValid && plateSectionValidation.isValid;
        if (!plateSectionValidation.isValid) {
            invalidFields.push(...plateSectionValidation.invalidFields);
        }
    }
    
    const editHasSecondPlateSection = document.getElementById('editHasSecondPlateSection');
    let secondPlateSectionValidation = { isValid: true, invalidFields: [] };
    
    if (editHasSecondPlateSection && editHasSecondPlateSection.checked) {
        secondPlateSectionValidation = validateEditSecondPlateSectionFields();
        isValid = isValid && secondPlateSectionValidation.isValid;
        if (!secondPlateSectionValidation.isValid) {
            invalidFields.push(...secondPlateSectionValidation.invalidFields);
        }
    }

    if (!isValid) {
        showError('Please fill in all required fields correctly');
        return;
    }

    const editPaperType = document.getElementById('editPaperType');
    const editBindingStyle = document.getElementById('editBindingStyle');
    const editLamination = document.getElementById('editLamination');
    
    let platePaperType = '';
    if (editHasPlateSection && editHasPlateSection.checked) {
        const editPlatePaperType = document.getElementById('editPlatePaperType');
        if (editPlatePaperType) {
            platePaperType = editPlatePaperType.options[editPlatePaperType.selectedIndex].text;
        }
    }
    
    let secondPlatePaperType = '';
    if (editHasSecondPlateSection && editHasSecondPlateSection.checked) {
        const editSecondPlatePaperType = document.getElementById('editSecondPlatePaperType');
        if (editSecondPlatePaperType) {
            secondPlatePaperType = editSecondPlatePaperType.options[editSecondPlatePaperType.selectedIndex].text;
        }
    }
    
    entries[currentEditingIndex] = {
        isbn: removeCommasFromString(isbn),
        title: removeCommasFromString(title),
        trimHeight: document.getElementById('editTrimHeight') ? document.getElementById('editTrimHeight').value : '',
        trimWidth: document.getElementById('editTrimWidth') ? document.getElementById('editTrimWidth').value : '',
        spineSize: document.getElementById('editSpineSize') ? document.getElementById('editSpineSize').value : '',
        paperType: editPaperType ? removeCommasFromString(editPaperType.options[editPaperType.selectedIndex].text) : '',
        bindingStyle: editBindingStyle ? removeCommasFromString(editBindingStyle.options[editBindingStyle.selectedIndex].text) : '',
        pageExtent: editPageExtent ? editPageExtent.value : '', // Use the potentially corrected value
        lamination: editLamination ? removeCommasFromString(editLamination.options[editLamination.selectedIndex].text) : '',
        hasPlateSection: editHasPlateSection ? editHasPlateSection.checked : false,
        plateInsertPage: (editHasPlateSection && editHasPlateSection.checked && document.getElementById('editPlateInsertPage')) ? document.getElementById('editPlateInsertPage').value : '',
        platePages: (editHasPlateSection && editHasPlateSection.checked && document.getElementById('editPlatePages')) ? document.getElementById('editPlatePages').value : '',
        platePaperType: removeCommasFromString(platePaperType),
        hasSecondPlateSection: editHasSecondPlateSection ? editHasSecondPlateSection.checked : false,
        secondPlateInsertPage: (editHasSecondPlateSection && editHasSecondPlateSection.checked && document.getElementById('editSecondPlateInsertPage')) ? document.getElementById('editSecondPlateInsertPage').value : '',
        secondPlatePages: (editHasSecondPlateSection && editHasSecondPlateSection.checked && document.getElementById('editSecondPlatePages')) ? document.getElementById('editSecondPlatePages').value : '',
        secondPlatePaperType: removeCommasFromString(secondPlatePaperType),
        isEdited: true,
        invalidFields: invalidFields
    };
    
    updateTable();
    currentEditingIndex = -1;
    
    setTimeout(() => {
        const modalElement = document.getElementById('editEntryModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            const editModal = bootstrap.Modal.getInstance(modalElement);
            if (editModal) {
                editModal.hide();
            } else {
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';
                modalElement.setAttribute('aria-hidden', 'true');
                modalElement.removeAttribute('aria-modal');
                modalElement.removeAttribute('role');
                
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
                
                document.body.classList.remove('modal-open');
                document.body.style.paddingRight = '';
                document.body.style.overflow = '';
            }
        }
    }, 50);
    
    showError('Entry updated successfully!');
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

    const hasPlateSection = document.getElementById('hasPlateSection');
    if (hasPlateSection) {
        hasPlateSection.checked = false;
        document.querySelectorAll('.plate-section-fields').forEach(field => {
            field.classList.add('d-none');
        });
    }
    
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection');
    if (hasSecondPlateSection) {
        hasSecondPlateSection.checked = false;
        document.querySelectorAll('.second-plate-section-fields').forEach(field => {
            field.classList.add('d-none');
        });
    }

    const titleCounter = document.getElementById('titleCounter');
    if (titleCounter) {
        titleCounter.textContent = '0 / 58 characters';
    }
}

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

    const hasPlateSection = document.getElementById('hasPlateSection');
    if (hasPlateSection) {
        hasPlateSection.checked = false;
        document.querySelectorAll('.plate-section-fields').forEach(field => {
            field.classList.add('d-none');
        });
    }
    
    const hasSecondPlateSection = document.getElementById('hasSecondPlateSection');
    if (hasSecondPlateSection) {
        hasSecondPlateSection.checked = false;
        document.querySelectorAll('.second-plate-section-fields').forEach(field => {
            field.classList.add('d-none');
        });
    }

    const titleCounter = document.getElementById('titleCounter');
    if (titleCounter) {
        titleCounter.textContent = '0 / 58 characters';
    }
}

function updateTable() {
    const tbody = document.getElementById('entriesTableBody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const filteredEntries = getFilteredEntries();
    
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredEntries.length);
    const pageEntries = filteredEntries.slice(startIndex, endIndex);
    
    pageEntries.forEach((entry, pageIndex) => {
        const realIndex = entries.indexOf(entry);
        
        if (realIndex === -1) {
            console.error('Could not find entry in original array', entry);
            return;
        }
        
        const tr = document.createElement('tr');
        
        if (entry.isEdited) {
            tr.style.backgroundColor = '#e3f2fd';
        }
        
        let plateSectionText = '';
        if (entry.hasPlateSection) {
            plateSectionText = `Insert after p${entry.plateInsertPage}-${entry.platePages}pp-${entry.platePaperType}`;
        }
        
        let secondPlateSectionText = '';
        if (entry.hasSecondPlateSection) {
            secondPlateSectionText = `Insert after p${entry.secondPlateInsertPage}-${entry.secondPlatePages}pp-${entry.secondPlatePaperType}`;
        }
        
        const invalidFields = entry.invalidFields || [];
        
        const safeEntry = {
            isbn: entry.isbn || '',
            title: entry.title || '',
            trimHeight: entry.trimHeight || '',
            trimWidth: entry.trimWidth || '',
            spineSize: entry.spineSize || '',
            paperType: entry.paperType || '',
            bindingStyle: entry.bindingStyle || '',
            pageExtent: entry.pageExtent || '',
            lamination: entry.lamination || ''
        };
        
        tr.innerHTML = `
            <td class="text-center">
                <input type="checkbox" class="form-check-input entry-select" data-index="${realIndex}">
            </td>
            <td class="text-nowrap">
                <button class="btn btn-danger btn-sm" onclick="deleteEntry(${realIndex})">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-warning btn-sm ms-1" onclick="editEntry(${realIndex})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-primary btn-sm ms-1" onclick="downloadXML(${realIndex})">
                    <i class="bi bi-file-earmark-code"></i>
                </button>
            </td>
            <td class="${invalidFields.includes('isbn') ? 'invalid-cell' : ''}">${safeEntry.isbn}${entry.isEdited ? ' <span style="color: #2196f3; font-size: 1em; font-weight: bold;">✓</span>' : ''}</td>
            <td class="${invalidFields.includes('title') ? 'invalid-cell' : ''}">${safeEntry.title}</td>
            <td class="${invalidFields.includes('trimHeight') ? 'invalid-cell' : ''}">${safeEntry.trimHeight}</td>
            <td class="${invalidFields.includes('trimWidth') ? 'invalid-cell' : ''}">${safeEntry.trimWidth}</td>
            <td>${safeEntry.spineSize}</td>
            <td class="${invalidFields.includes('paperType') ? 'invalid-cell' : ''}">${safeEntry.paperType}</td>
            <td class="${invalidFields.includes('bindingStyle') ? 'invalid-cell' : ''}">${safeEntry.bindingStyle}</td>
            <td class="${invalidFields.includes('pageExtent') ? 'invalid-cell' : ''}">${safeEntry.pageExtent}</td>
            <td class="${invalidFields.includes('lamination') ? 'invalid-cell' : ''}">${safeEntry.lamination}</td>
            <td class="${entry.hasPlateSection && (invalidFields.includes('plateInsertPage') || invalidFields.includes('platePages') || invalidFields.includes('platePaperType')) ? 'invalid-cell' : ''}">${plateSectionText}</td>
            <td class="${entry.hasSecondPlateSection && (invalidFields.includes('secondPlateInsertPage') || invalidFields.includes('secondPlatePages') || invalidFields.includes('secondPlatePaperType')) ? 'invalid-cell' : ''}">${secondPlateSectionText}</td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePagination(filteredEntries.length);
    updateSearchInfo();
    updateResetEditedStatusButton();
}

function resetEditedStatus() {
    if (confirm('Are you sure you want to remove the edited status from all entries? This will clear all visual indicators but keep your data changes.')) {
        let editedCount = 0;
        
        entries.forEach(entry => {
            if (entry.isEdited) {
                entry.isEdited = false;
                editedCount++;
            }
        });
        
        updateTable();
        updateResetEditedStatusButton();
        
        if (editedCount > 0) {
            showError(`Edited status removed from ${editedCount} entries`);
        } else {
            showError('No edited entries found');
        }
    }
}

function updateResetEditedStatusButton() {
    const resetBtn = document.getElementById('resetEditedStatusBtn');
    if (resetBtn) {
        const hasEditedEntries = entries.some(entry => entry.isEdited);
        if (hasEditedEntries) {
            resetBtn.classList.remove('d-none');
        } else {
            resetBtn.classList.add('d-none');
        }
    }
}

function updateButtonStates() {
    enableDownloadButton();
    updateResetEditedStatusButton();
    
    const checkedBoxes = document.querySelectorAll('.entry-select:checked').length;
    const downloadXMLBtn = document.getElementById('downloadXMLBtn');
    if (downloadXMLBtn) {
        downloadXMLBtn.disabled = checkedBoxes === 0;
    }
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
    const plateSectionXML = entry.hasPlateSection ? `
        <plate_section>
            <insert_after_page>${escapeXML(entry.plateInsertPage)}</insert_after_page>
            <plate_pages>${escapeXML(entry.platePages)}</plate_pages>
            <plate_paper_type>${escapeXML(entry.platePaperType)}</plate_paper_type>
        </plate_section>` : '';
        
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
    const cleanISBN = entry.isbn.replace(/[^0-9]/g, '');
    
    if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        zip.file(`${cleanISBN}_t.xml`, xml);
        zip.file(`${cleanISBN}_c.xml`, xml);
        
        zip.generateAsync({ type: 'blob' })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${cleanISBN}_xml_files.zip`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
    } else {
        // Fallback: download single XML file
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cleanISBN}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

function downloadSelectedXML() {
    const selectedIndexes = Array.from(document.querySelectorAll('.entry-select:checked'))
        .map(checkbox => parseInt(checkbox.dataset.index));
    
    if (selectedIndexes.length === 0) {
        showError('No entries selected');
        return;
    }
    
    if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        selectedIndexes.forEach(index => {
            const entry = entries[index];
            const xml = generateXML(entry);
            const cleanISBN = entry.isbn.replace(/[^0-9]/g, '');
            
            zip.file(`${cleanISBN}_t.xml`, xml);
            zip.file(`${cleanISBN}_c.xml`, xml);
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
    } else {
        showError('JSZip library not available');
    }
}

// Add event listener for checkbox changes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('entry-select')) {
        const checkedBoxes = document.querySelectorAll('.entry-select:checked').length;
        const downloadXMLBtn = document.getElementById('downloadXMLBtn');
        if (downloadXMLBtn) {
            downloadXMLBtn.disabled = checkedBoxes === 0;
        }
    }
});

function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        entries.splice(index, 1);
        updateTable();
        updateButtonStates();
        updateSearchInfo();
    }
}

// Add event listener for select all checkbox
document.addEventListener('DOMContentLoaded', function() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.entry-select');
            checkboxes.forEach(checkbox => checkbox.checked = this.checked);
            const downloadXMLBtn = document.getElementById('downloadXMLBtn');
            if (downloadXMLBtn) {
                downloadXMLBtn.disabled = !this.checked;
            }
        });
    }
});

// Drag and drop functionality
const dropzone = document.getElementById('dropzone');

if (dropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    dropzone.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.classList.add('dragover');
    }
}

function unhighlight(e) {
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.classList.remove('dragover');
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('fileUpload');
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                processExcelFile(file);
                this.value = '';
            }
        });
    }
});

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
        
        if (typeof XLSX !== 'undefined') {
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
        } else {
            showError('XLSX library not available');
        }
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
    let commaRemovedCount = 0;

    const paperTypeElement = document.getElementById('paperType');
    const bindingStyleElement = document.getElementById('bindingStyle');
    const laminationElement = document.getElementById('lamination');
    const platePaperTypeElement = document.getElementById('platePaperType');

    const validPaperTypes = paperTypeElement ? Array.from(paperTypeElement.options).map(opt => opt.text) : [];
    const validBindingStyles = bindingStyleElement ? Array.from(bindingStyleElement.options).map(opt => opt.text) : [];
    const validLaminations = laminationElement ? Array.from(laminationElement.options).map(opt => opt.text) : [];
    const validPlatePaperTypes = platePaperTypeElement ? Array.from(platePaperTypeElement.options).map(opt => opt.text) : [];

    jsonData.forEach((row) => {
        const cleanedRow = cleanStringFieldsForCSV(row);
        
        const originalStringFields = Object.values(row).filter(val => typeof val === 'string').join('');
        const cleanedStringFields = Object.values(cleanedRow).filter(val => typeof val === 'string').join('');
        if (originalStringFields.length > cleanedStringFields.length) {
            commaRemovedCount++;
        }

        const trimWidth = parseInt(cleanedRow['Trim Width']) || 0;
        const pageExtent = parseInt(cleanedRow['Page Extent']) || 0;
        const divisor = trimWidth <= NARROW_WIDTH_THRESHOLD ? 6 : 4;
        const adjustedPageExtent = Math.ceil(pageExtent / divisor) * divisor;
        
        const paperTypeKey = Object.keys(PAPER_SPECS).find(key => 
            PAPER_SPECS[key].name === cleanedRow['Paper Type']
        );

        let title = removeCommasFromString(cleanedRow['Title'] || '');
        const invalidFields = [];
        
        if (title.length > 58) {
            title = title.substring(0, 58);
            invalidFields.push('title');
        }

        let hasPlateSection = false;
        let plateInsertPage = '';
        let platePages = '';
        let platePaperType = '';
        
        const plateSectionText = removeCommasFromString(cleanedRow['Plate Section 1'] || '');
        if (plateSectionText) {
            hasPlateSection = true;
            
            const platePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
            const matches = plateSectionText.match(platePattern);
            
            if (matches && matches.length >= 4) {
                plateInsertPage = matches[1];
                platePages = matches[2];
                platePaperType = removeCommasFromString(matches[3]);
            } else {
                invalidFields.push('plateInsertPage', 'platePages', 'platePaperType');
            }
        }
        
        let hasSecondPlateSection = false;
        let secondPlateInsertPage = '';
        let secondPlatePages = '';
        let secondPlatePaperType = '';
        
        const secondPlateSectionText = removeCommasFromString(cleanedRow['Plate Section 2'] || '');
        if (secondPlateSectionText) {
            hasSecondPlateSection = true;
            
            const secondPlatePattern = /Insert after p(\d+)-(\d+)pp-(.*)/;
            const secondMatches = secondPlateSectionText.match(secondPlatePattern);
            
            if (secondMatches && secondMatches.length >= 4) {
                secondPlateInsertPage = secondMatches[1];
                secondPlatePages = secondMatches[2];
                secondPlatePaperType = removeCommasFromString(secondMatches[3]);
            } else {
                invalidFields.push('secondPlateInsertPage', 'secondPlatePages', 'secondPlatePaperType');
            }
        }

        const entry = {
            isbn: removeCommasFromString(cleanedRow['ISBN'] || ''),
            title: title,
            trimHeight: cleanedRow['Trim Height'] || '',
            trimWidth: trimWidth.toString(),
            paperType: removeCommasFromString(cleanedRow['Paper Type'] || ''),
            bindingStyle: removeCommasFromString(cleanedRow['Binding Style'] || ''),
            pageExtent: adjustedPageExtent.toString(),
            spineSize: '',
            lamination: removeCommasFromString(cleanedRow['Lamination'] || ''),
            hasPlateSection: hasPlateSection,
            plateInsertPage: plateInsertPage,
            platePages: platePages,
            platePaperType: platePaperType,
            hasSecondPlateSection: hasSecondPlateSection,
            secondPlateInsertPage: secondPlateInsertPage,
            secondPlatePages: secondPlatePages,
            secondPlatePaperType: secondPlatePaperType,
            isEdited: false,
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

    currentPage = 1;
    updateTable();
    updateButtonStates();
    
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    if (deleteAllBtn) {
        deleteAllBtn.disabled = entries.length === 0;
    }
    
    const selectAllCheckbox = document.getElementById('selectAll');
    const downloadXMLBtn = document.getElementById('downloadXMLBtn');
    
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    if (downloadXMLBtn) downloadXMLBtn.disabled = true;

    const truncatedCount = entries.filter(e => e.invalidFields && e.invalidFields.includes('title')).length;
    const truncationMsg = truncatedCount > 0 ? ` (${truncatedCount} titles truncated to 58 characters)` : '';
    const commaMsg = commaRemovedCount > 0 ? ` (commas removed from ${commaRemovedCount} entries)` : '';
    showError(`Imported ${validCount} valid and ${invalidCount} invalid entries${truncationMsg}${commaMsg}`);
}

function deleteAllEntries() {
    if (entries.length === 0) {
        showError('No entries to delete');
        return;
    }
    
    if (confirm('Are you sure you want to delete all entries?')) {
        entries.length = 0;
        currentPage = 1;
        updateTable();
        enableDownloadButton();
        
        const deleteAllBtn = document.getElementById('deleteAllBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const downloadXMLBtn = document.getElementById('downloadXMLBtn');
        const selectAll = document.getElementById('selectAll');
        const resetEditedBtn = document.getElementById('resetEditedStatusBtn');
        
        if (deleteAllBtn) deleteAllBtn.disabled = true;
        if (downloadBtn) downloadBtn.disabled = true;
        if (downloadXMLBtn) downloadXMLBtn.disabled = true;
        if (selectAll) selectAll.checked = false;
        if (resetEditedBtn) resetEditedBtn.classList.add('d-none');
        
        const searchInput = document.getElementById('searchISBN');
        if (searchInput) searchInput.value = '';
        searchFilter = '';
        updateSearchInfo();
        
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) fileUpload.value = '';
        
        showError('All entries deleted successfully');
    }
}

function showError(message, duration = 4000) {
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');

    if (!error || !errorMessage) return;

    if (window.errorTimeout) {
        clearTimeout(window.errorTimeout);
    }

    error.classList.remove('d-none', 'fade-out');
    errorMessage.textContent = message;

    window.errorTimeout = setTimeout(() => {
        error.classList.add('fade-out');

        setTimeout(() => {
            error.classList.add('d-none');
            error.classList.remove('fade-out');
        }, 1000);
    }, duration);
}

function enableDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    
    if (downloadBtn) {
        downloadBtn.disabled = entries.length === 0;
    }
    if (deleteAllBtn) {
        deleteAllBtn.disabled = entries.length === 0;
    }
}

function generateCSV() {
    if (entries.length === 0) {
        showError('No entries to export');
        return;
    }
    
    let exportEntries = entries;
    if (searchFilter) {
        exportEntries = entries.filter(entry => 
            entry.isbn && entry.isbn.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }
    
    const updateToggle = document.getElementById('updateToggle');
    const mode = updateToggle && updateToggle.checked ? 'UPDT' : 'NEW';
    
    function getPaperGrammage(paperType) {
        const paperSpec = Object.values(PAPER_SPECS).find(spec => spec.name === paperType);
        return paperSpec ? paperSpec.grammage.toString() : '';
    }
    
    const rows = exportEntries.map(entry => {
        const plateSection1 = entry.hasPlateSection ? 
            `Insert after p${entry.plateInsertPage}-${entry.platePages}pp-${entry.platePaperType}` : '';
        const plateSection2 = entry.hasSecondPlateSection ? 
            `Insert after p${entry.secondPlateInsertPage}-${entry.secondPlatePages}pp-${entry.secondPlatePaperType}` : '';
        
        return [
            'ISBN',
            mode,
            entry.isbn,
            entry.title,
            entry.bindingStyle,
            entry.lamination,
            entry.trimHeight,
            entry.trimWidth,
            entry.spineSize,
            entry.pageExtent,
            getPaperGrammage(entry.paperType),
            entry.paperType,
            'N',
            plateSection1,
            plateSection2
        ].map(field => `"${field}"`).join(',');
    });
    
    const csvContent = rows.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '_').replace('T', '_').replace('Z', '');
    const filename = searchFilter ? 
        `itemTemplate${timestamp}_filtered.csv` : 
        `itemTemplate${timestamp}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    const message = searchFilter ? 
        `CSV exported with ${exportEntries.length} filtered entries (${mode} mode)` :
        `CSV exported with ${exportEntries.length} entries (${mode} mode)`;
    showError(message);
}

    // Add the same logic for edit modal
    const editTrimWidthElement = document.getElementById('editTrimWidth');
    if (editTrimWidthElement) {
        editTrimWidthElement.addEventListener('input', function() {
            const pageExtentInput = document.getElementById('editPageExtent');
            if (!pageExtentInput) return;
            
            const originalExtent = parseInt(pageExtentInput.value) || 0;
            if (originalExtent > 0) {
                const adjustedExtent = calculatePageExtent(originalExtent, parseInt(this.value) || 0);
                pageExtentInput.value = adjustedExtent;
                updateEditSpineSize();
            }
        });
    }


// Update spine size when relevant fields change
function updateSpineSize() {
    const pageExtentElement = document.getElementById('pageExtent');
    const paperTypeElement = document.getElementById('paperType');
    const bindingStyleElement = document.getElementById('bindingStyle');
    const spineSizeElement = document.getElementById('spineSize');

    if (!pageExtentElement || !paperTypeElement || !bindingStyleElement || !spineSizeElement) return;

    const pageExtent = parseInt(pageExtentElement.value) || 0;
    const paperType = paperTypeElement.value;
    const bindingStyle = bindingStyleElement.value;

    if (pageExtent && paperType && bindingStyle) {
        const spineSize = calculateSpineSize(pageExtent, paperType, bindingStyle);
        spineSizeElement.value = spineSize;
    }
}

// Update spine size for edit modal
function updateEditSpineSize() {
    const pageExtentElement = document.getElementById('editPageExtent');
    const paperTypeElement = document.getElementById('editPaperType');
    const bindingStyleElement = document.getElementById('editBindingStyle');
    const spineSizeElement = document.getElementById('editSpineSize');

    if (!pageExtentElement || !paperTypeElement || !bindingStyleElement || !spineSizeElement) return;

    const pageExtent = parseInt(pageExtentElement.value) || 0;
    const paperType = paperTypeElement.value;
    const bindingStyle = bindingStyleElement.value;

    if (pageExtent && paperType && bindingStyle) {
        const spineSize = calculateSpineSize(pageExtent, paperType, bindingStyle);
        spineSizeElement.value = spineSize;
    }
}

// Add event listeners for spine size calculation
document.addEventListener('DOMContentLoaded', function() {
    ['pageExtent', 'paperType', 'bindingStyle'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateSpineSize);
        }
    });

    // Add event listeners for edit modal spine size calculation
    ['editPageExtent', 'editPaperType', 'editBindingStyle'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateEditSpineSize);
        }
    });
});

// ISBN validation
function isValidISBN(isbn) {
    const cleaned = isbn.replace(/[-\s]/g, '');

    if (cleaned.length !== 13) {
        return {
            isValid: false,
            error: 'ISBN must be exactly 13 digits'
        };
    }

    if (!/^\d{13}$/.test(cleaned)) {
        return {
            isValid: false,
            error: 'ISBN must contain only digits'
        };
    }

    if (!cleaned.startsWith('978') && !cleaned.startsWith('979')) {
        return {
            isValid: false,
            error: 'ISBN must start with 978 or 979'
        };
    }

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
document.addEventListener('DOMContentLoaded', function() {
    const isbnElement = document.getElementById('isbn');
    if (isbnElement) {
        isbnElement.addEventListener('input', function() {
            const validation = isValidISBN(this.value);
            if (!validation.isValid) {
                this.classList.add('is-invalid');
                const existingFeedback = document.getElementById('isbn-feedback');
                if (existingFeedback) existingFeedback.remove();

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
    }

    // Add real-time ISBN validation for edit modal
    const editISBNElement = document.getElementById('editISBN');
    if (editISBNElement) {
        editISBNElement.addEventListener('input', function() {
            const validation = isValidISBN(this.value);
            if (!validation.isValid) {
                this.classList.add('is-invalid');
                const existingFeedback = document.getElementById('editISBN-feedback');
                if (existingFeedback) existingFeedback.remove();

                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback d-block';
                feedback.id = 'editISBN-feedback';
                feedback.textContent = validation.error;
                this.parentNode.appendChild(feedback);
            } else {
                this.classList.remove('is-invalid');
                const feedback = document.getElementById('editISBN-feedback');
                if (feedback) feedback.remove();
            }
        });
    }
});

// Update title character counter with immediate validation
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.addEventListener('input', function() {
            const counter = document.getElementById('titleCounter');
            if (!counter) return;
            
            const length = this.value.length;
            counter.textContent = `${length} / 58 characters`;

            if (length > 58) {
                counter.classList.add('text-danger');
                this.classList.add('is-invalid');
                const existingFeedback = document.getElementById('title-feedback');
                if (existingFeedback) existingFeedback.remove();

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
    }

    // Update title character counter for edit modal
    const editTitleElement = document.getElementById('editTitle');
    if (editTitleElement) {
        editTitleElement.addEventListener('input', function() {
            const counter = document.getElementById('editTitleCounter');
            if (!counter) return;
            
            const length = this.value.length;
            counter.textContent = `${length} / 58 characters`;

            if (length > 58) {
                counter.classList.add('text-danger');
                this.classList.add('is-invalid');
                const existingFeedback = document.getElementById('editTitle-feedback');
                if (existingFeedback) existingFeedback.remove();

                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback d-block';
                feedback.id = 'editTitle-feedback';
                feedback.textContent = 'Title cannot exceed 58 characters';
                this.parentNode.appendChild(feedback);
            } else {
                counter.classList.remove('text-danger');
                this.classList.remove('is-invalid');
                const feedback = document.getElementById('editTitle-feedback');
                if (feedback) feedback.remove();
            }
        });
    }
});