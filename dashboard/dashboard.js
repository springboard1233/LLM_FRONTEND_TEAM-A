// Dashboard JavaScript functionality

// Toggle profile menu
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('active');
}

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileSection = document.querySelector('.profile-section');
    const profileMenu = document.getElementById('profileMenu');
    
    if (!profileSection.contains(event.target)) {
        profileMenu.classList.remove('active');
    }
});

// Handle profile menu item clicks
document.addEventListener('DOMContentLoaded', function() {
    const profileMenuItems = document.querySelectorAll('.profile-menu-item');
    
    profileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'My Profile':
                    console.log('Opening profile page...');
                    showProfileModal();
                    break;
                case 'Settings':
                    console.log('Opening settings page...');
                    showSettingsModal();
                    break;
                case 'Logout':
                    console.log('Logout requested...');
                    // Check if logout confirmation is required
                    const requireConfirmation = localStorage.getItem('requireConfirmation') !== 'false';
                    if (requireConfirmation) {
                        showLogoutModal();
                    } else {
                        confirmLogout();
                    }
                    break;
            }
            
            // Close the menu after selection
            document.getElementById('profileMenu').classList.remove('active');
        });
    });
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for any anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for dashboard content
function showLoading() {
    const dashboardContainer = document.querySelector('.dashboard-container');
    dashboardContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    `;
}

function hideLoading() {
    // This function can be used to hide loading and show actual content
    console.log('Loading complete');
}

// Example usage: showLoading() when fetching data
// hideLoading() when data is ready

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close profile menu on Escape key
        const profileMenu = document.getElementById('profileMenu');
        profileMenu.classList.remove('active');
    }
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could be used for additional functionality
            console.log('Swiped up');
        } else {
            // Swipe down - could be used for additional functionality
            console.log('Swiped down');
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized successfully!');
    
    // Load and display user's name
    loadUserName();
    
    // Initialize file upload functionality
    initializeFileUpload();
    
    // You can add more initialization logic here
    // For example: load user data, fetch dashboard statistics, etc.
});

// Load and display user's name from localStorage
function loadUserName() {
    const userNameElement = document.getElementById('userName');
    const storedFirstName = localStorage.getItem('userFirstName');
    
    if (storedFirstName && storedFirstName !== 'User') {
        userNameElement.textContent = storedFirstName;
        console.log('Welcome, ' + storedFirstName + '!');
    } else {
        // If no name stored, try to get from URL parameters or show default
        const urlParams = new URLSearchParams(window.location.search);
        const nameFromUrl = urlParams.get('name');
        
        if (nameFromUrl) {
            userNameElement.textContent = nameFromUrl;
            localStorage.setItem('userFirstName', nameFromUrl);
        } else {
            userNameElement.textContent = 'User';
        }
    }
}

// ===== FILE UPLOAD AND DATASET ANALYSIS =====

let currentDataset = null;

// Initialize file upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('csvFileInput');
    const uploadArea = document.getElementById('fileUploadArea');
    
    // File input change event
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Remove the click event from upload area to prevent double triggering
    // Only the button should trigger file selection
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
        processCSVFile(file);
    } else if (file) {
        // Only show alert if file is selected but wrong type
        alert('Please select a valid CSV file!');
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
        processCSVFile(files[0]);
    } else {
        alert('Please drop a valid CSV file!');
    }
}

// Process CSV file
function processCSVFile(file) {
    showUploadProgress();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvData = e.target.result;
            const dataset = parseCSV(csvData);
            currentDataset = dataset;
            
                         hideUploadProgress();
             performDatasetAnalysis(dataset);
             showAnalysisResults();
        } catch (error) {
            console.error('Error processing CSV:', error);
            alert('Error processing CSV file. Please check the file format.');
            hideUploadProgress();
        }
    };
    
    reader.readAsText(file);
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    
    return { headers, data, rawText: csvText };
}

// Show upload progress
function showUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('fileUploadArea').style.display = 'none';
    
    // Simulate progress
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressText.textContent = 'Processing dataset...';
        }
        progressFill.style.width = progress + '%';
    }, 100);
}

// Hide upload progress
function hideUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'none';
    document.getElementById('fileUploadArea').style.display = 'block';
}

// Show analysis results
function showAnalysisResults() {
    document.getElementById('analysisResults').style.display = 'block';
}

// Perform comprehensive dataset analysis
function performDatasetAnalysis(dataset) {
    console.log('Analyzing dataset:', dataset);
    
    // Basic Statistics
    displayBasicStatistics(dataset);
    
    // Data Quality Analysis
    displayDataQuality(dataset);
    
    // Column Analysis
    displayColumnAnalysis(dataset);
    
    // Data Distribution
    displayDataDistribution(dataset);
    
    // Correlation Analysis
    displayCorrelationAnalysis(dataset);
    
    // Missing Values Analysis
    displayMissingValues(dataset);
    
         // Fraud vs Legitimate Analysis
     displayFraudAnalysis(dataset);
     
     // Transaction Summary
     displayTransactionSummary(dataset);
     
     // Spending Categories
     displaySpendingCategories(dataset);
}

// Display basic statistics
function displayBasicStatistics(dataset) {
    const statsContainer = document.getElementById('basicStats');
    const { headers, data } = dataset;
    
    const stats = [
        { label: 'Total Rows', value: data.length },
        { label: 'Total Columns', value: headers.length },
        { label: 'File Size', value: formatFileSize(dataset.rawText.length) },
        { label: 'Memory Usage', value: formatFileSize(JSON.stringify(data).length) }
    ];
    
    statsContainer.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <h5>${stat.label}</h5>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');
}

// Display data quality metrics
function displayDataQuality(dataset) {
    const qualityContainer = document.getElementById('dataQuality');
    const { headers, data } = dataset;
    
    const totalCells = headers.length * data.length;
    const emptyCells = data.reduce((count, row) => {
        return count + headers.filter(header => !row[header] || row[header].trim() === '').length;
    }, 0);
    
    const completeness = ((totalCells - emptyCells) / totalCells * 100).toFixed(2);
    const consistency = calculateDataConsistency(dataset);
    const uniqueness = calculateDataUniqueness(dataset);
    
    const metrics = [
        { label: 'Data Completeness', value: completeness + '%' },
        { label: 'Data Consistency', value: consistency + '%' },
        { label: 'Data Uniqueness', value: uniqueness + '%' },
        { label: 'Empty Cells', value: emptyCells }
    ];
    
    qualityContainer.innerHTML = metrics.map(metric => `
        <div class="quality-metric">
            <h6>${metric.label}</h6>
            <div class="metric-value">${metric.value}</div>
        </div>
    `).join('');
}

// Display column analysis
function displayColumnAnalysis(dataset) {
    const columnContainer = document.getElementById('columnAnalysis');
    const { headers, data } = dataset;
    
    const columnInfo = headers.map(header => {
        const values = data.map(row => row[header]).filter(v => v && v.trim() !== '');
        const uniqueValues = new Set(values).size;
        const dataType = inferDataType(values);
        
        return { header, uniqueValues, dataType, totalValues: values.length };
    });
    
    columnContainer.innerHTML = columnInfo.map(col => `
        <div class="column-card">
            <h6>${col.header}</h6>
            <div class="column-info">
                <p><strong>Data Type:</strong> ${col.dataType}</p>
                <p><strong>Unique Values:</strong> ${col.uniqueValues}</p>
                <p><strong>Total Values:</strong> ${col.totalValues}</p>
                <p><strong>Missing Values:</strong> ${data.length - col.totalValues}</p>
            </div>
        </div>
    `).join('');
}

// Display data distribution
function displayDataDistribution(dataset) {
    const distributionContainer = document.getElementById('dataDistribution');
    const { headers, data } = dataset;
    
    // Find numeric columns for distribution analysis
    const numericColumns = headers.filter(header => {
        const values = data.map(row => row[header]).filter(v => v && v.trim() !== '');
        return values.length > 0 && !isNaN(values[0]);
    }).slice(0, 4); // Limit to 4 columns for display
    
    const distributionHTML = numericColumns.map(col => {
        const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const median = calculateMedian(values);
        
        return `
            <div class="chart-container">
                <h6>${col} Distribution</h6>
                <div class="column-info">
                    <p><strong>Min:</strong> ${min.toFixed(2)}</p>
                    <p><strong>Max:</strong> ${max.toFixed(2)}</p>
                    <p><strong>Mean:</strong> ${mean.toFixed(2)}</p>
                    <p><strong>Median:</strong> ${median.toFixed(2)}</p>
                    <p><strong>Range:</strong> ${(max - min).toFixed(2)}</p>
                </div>
            </div>
        `;
    }).join('');
    
    distributionContainer.innerHTML = distributionHTML || '<p>No numeric columns found for distribution analysis.</p>';
}

// Display correlation analysis
function displayCorrelationAnalysis(dataset) {
    const correlationContainer = document.getElementById('correlationAnalysis');
    const { headers, data } = dataset;
    
    // Find numeric columns
    const numericColumns = headers.filter(header => {
        const values = data.map(row => row[header]).filter(v => v && v.trim() !== '');
        return values.length > 0 && !isNaN(values[0]);
    });
    
    if (numericColumns.length < 2) {
        correlationContainer.innerHTML = '<p>Need at least 2 numeric columns for correlation analysis.</p>';
        return;
    }
    
    // Calculate correlation matrix
    const correlationMatrix = calculateCorrelationMatrix(numericColumns, data);
    
    // Create correlation table
    let tableHTML = '<table class="correlation-table"><thead><tr><th>Column</th>';
    numericColumns.forEach(col => {
        tableHTML += `<th>${col}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    numericColumns.forEach((col1, i) => {
        tableHTML += `<tr><td><strong>${col1}</strong></td>`;
        numericColumns.forEach((col2, j) => {
            const correlation = correlationMatrix[i][j];
            const color = Math.abs(correlation) > 0.7 ? '#00ff00' : 
                         Math.abs(correlation) > 0.5 ? '#ffff00' : '#ffffff';
            tableHTML += `<td style="color: ${color}">${correlation.toFixed(3)}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    correlationContainer.innerHTML = tableHTML;
}

// Display missing values analysis
function displayMissingValues(dataset) {
    const missingContainer = document.getElementById('missingValues');
    const { headers, data } = dataset;
    
    const missingAnalysis = headers.map(header => {
        const missingCount = data.filter(row => !row[header] || row[header].trim() === '').length;
        const missingPercentage = (missingCount / data.length * 100).toFixed(2);
        
        return { header, missingCount, missingPercentage };
    }).filter(col => col.missingCount > 0);
    
    if (missingAnalysis.length === 0) {
        missingContainer.innerHTML = '<p>No missing values found in the dataset! 🎉</p>';
        return;
    }
    
    missingContainer.innerHTML = missingAnalysis.map(col => `
        <div class="missing-card">
            <h6>${col.header}</h6>
            <div class="missing-count">${col.missingCount}</div>
            <p>${col.missingPercentage}% of total</p>
        </div>
    `).join('');
}

// Display fraud vs legitimate analysis
function displayFraudAnalysis(dataset) {
    const fraudContainer = document.getElementById('fraudAnalysis');
    const { headers, data } = dataset;
    
    // Try to find fraud-related columns
    const fraudColumns = headers.filter(header => 
        header.toLowerCase().includes('fraud') || 
        header.toLowerCase().includes('is_fraud') ||
        header.toLowerCase().includes('class') ||
        header.toLowerCase().includes('target')
    );
    
    if (fraudColumns.length > 0) {
        const fraudColumn = fraudColumns[0];
        const fraudValues = data.map(row => row[fraudColumn]).filter(v => v && v.trim() !== '');
        
        // Count fraud vs legitimate
        const fraudCount = fraudValues.filter(v => 
            v.toString().toLowerCase() === '1' || 
            v.toString().toLowerCase() === 'true' || 
            v.toString().toLowerCase() === 'fraud' ||
            v.toString().toLowerCase() === 'yes'
        ).length;
        
        const legitimateCount = fraudValues.length - fraudCount;
        const totalCount = fraudValues.length;
        
        const fraudPercentage = totalCount > 0 ? ((fraudCount / totalCount) * 100).toFixed(2) : 0;
        const legitimatePercentage = totalCount > 0 ? ((legitimateCount / totalCount) * 100).toFixed(2) : 0;
        
        fraudContainer.innerHTML = `
            <div class="fraud-card">
                <h6>🕵️ Fraudulent Transactions</h6>
                <div class="fraud-count">${fraudCount}</div>
                <div class="fraud-percentage">${fraudPercentage}% of total</div>
            </div>
            <div class="fraud-card legitimate">
                <h6>✅ Legitimate Transactions</h6>
                <div class="fraud-count">${legitimateCount}</div>
                <div class="fraud-percentage">${legitimatePercentage}% of total</div>
            </div>
        `;
    } else {
        // If no fraud column found, show generic analysis
        fraudContainer.innerHTML = `
            <div class="fraud-card">
                <h6>📊 Transaction Analysis</h6>
                <div class="fraud-count">${data.length}</div>
                <div class="fraud-percentage">Total transactions analyzed</div>
            </div>
        `;
    }
}

// ===== HELPER FUNCTIONS =====

// Calculate data consistency
function calculateDataConsistency(dataset) {
    const { headers, data } = dataset;
    let consistentRows = 0;
    
    data.forEach(row => {
        const hasAllRequiredFields = headers.every(header => 
            row[header] && row[header].trim() !== ''
        );
        if (hasAllRequiredFields) consistentRows++;
    });
    
    return Math.round((consistentRows / data.length) * 100);
}

// Calculate data uniqueness
function calculateDataUniqueness(dataset) {
    const { data } = dataset;
    const uniqueRows = new Set(data.map(row => JSON.stringify(row))).length;
    return Math.round((uniqueRows / data.length) * 100);
}

// Infer data type
function inferDataType(values) {
    if (values.length === 0) return 'Unknown';
    
    const sample = values.slice(0, 100); // Check first 100 values
    const numericCount = sample.filter(v => !isNaN(v) && v.trim() !== '').length;
    const dateCount = sample.filter(v => !isNaN(Date.parse(v)) && v.trim() !== '').length;
    
    if (numericCount / sample.length > 0.8) return 'Numeric';
    if (dateCount / sample.length > 0.8) return 'Date';
    return 'Text';
}

// Calculate median
function calculateMedian(values) {
    const sorted = values.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? 
        (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// Calculate correlation matrix
function calculateCorrelationMatrix(columns, data) {
    const matrix = [];
    
    columns.forEach((col1, i) => {
        matrix[i] = [];
        const values1 = data.map(row => parseFloat(row[col1])).filter(v => !isNaN(v));
        
        columns.forEach((col2, j) => {
            if (i === j) {
                matrix[i][j] = 1.0;
            } else {
                const values2 = data.map(row => parseFloat(row[col2])).filter(v => !isNaN(v));
                matrix[i][j] = calculateCorrelation(values1, values2);
            }
        });
    });
    
    return matrix;
}

// Calculate correlation coefficient
function calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Display transaction summary
function displayTransactionSummary(dataset) {
    const summaryContainer = document.getElementById('transactionSummary');
    const { headers, data } = dataset;
    
    // Try to find amount-related columns
    const amountColumns = headers.filter(header => 
        header.toLowerCase().includes('amount') || 
        header.toLowerCase().includes('value') ||
        header.toLowerCase().includes('price') ||
        header.toLowerCase().includes('cost')
    );
    
    let totalTransactions = data.length;
    let averageAmount = 0;
    let totalAmount = 0;
    
    if (amountColumns.length > 0) {
        const amountColumn = amountColumns[0];
        const amounts = data.map(row => parseFloat(row[amountColumn])).filter(v => !isNaN(v));
        
        if (amounts.length > 0) {
            totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
            averageAmount = totalAmount / amounts.length;
        }
    }
    
    summaryContainer.innerHTML = `
        <div class="transaction-card">
            <h6>📊 Total Transactions</h6>
            <div class="transaction-value">${totalTransactions.toLocaleString()}</div>
            <div class="transaction-label">Records analyzed</div>
        </div>
        <div class="transaction-card">
            <h6>💰 Total Amount</h6>
            <div class="transaction-value">$${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="transaction-label">Sum of all transactions</div>
        </div>
        <div class="transaction-card">
            <h6>📈 Average Amount</h6>
            <div class="transaction-value">$${averageAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div class="transaction-label">Mean transaction value</div>
        </div>
    `;
}

// Display spending categories
function displaySpendingCategories(dataset) {
    const categoriesContainer = document.getElementById('spendingCategories');
    const { headers, data } = dataset;
    
    // Try to find category-related columns
    const categoryColumns = headers.filter(header => 
        header.toLowerCase().includes('category') || 
        header.toLowerCase().includes('type') ||
        header.toLowerCase().includes('merchant') ||
        header.toLowerCase().includes('description')
    );
    
    if (categoryColumns.length > 0) {
        const categoryColumn = categoryColumns[0];
        const amountColumn = headers.find(header => 
            header.toLowerCase().includes('amount') || 
            header.toLowerCase().includes('value')
        );
        
        // Group by category and calculate totals
        const categoryMap = new Map();
        
        data.forEach(row => {
            const category = row[categoryColumn] || 'Unknown';
            const amount = amountColumn ? parseFloat(row[amountColumn]) || 0 : 1;
            
            if (categoryMap.has(category)) {
                categoryMap.set(category, categoryMap.get(category) + amount);
            } else {
                categoryMap.set(category, amount);
            }
        });
        
        // Sort by amount and take top 6
        const sortedCategories = Array.from(categoryMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
        
        const totalAmount = sortedCategories.reduce((sum, [_, amount]) => sum + amount, 0);
        
        const categoriesHTML = sortedCategories.map(([category, amount]) => {
            const percentage = totalAmount > 0 ? (amount / totalAmount * 100).toFixed(1) : 0;
            return `
                <div class="category-card">
                    <h6>${category}</h6>
                    <div class="category-info">
                        <p><strong>Amount:</strong> $${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <p><strong>Percentage:</strong> ${percentage}%</p>
                        <div class="category-bar">
                            <div class="category-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        categoriesContainer.innerHTML = categoriesHTML;
    } else {
        // If no category column found, show generic analysis
        categoriesContainer.innerHTML = `
            <div class="category-card">
                <h6>📊 Data Overview</h6>
                <div class="category-info">
                    <p><strong>Total Records:</strong> ${data.length}</p>
                    <p><strong>Columns:</strong> ${headers.length}</p>
                    <p><strong>Data Types:</strong> Mixed (text, numeric, categorical)</p>
                </div>
            </div>
        `;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== LOGOUT MODAL FUNCTIONS =====

// Show logout confirmation modal
function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('active');
}

// Hide logout confirmation modal
function hideLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.remove('active');
}

// Cancel logout
function cancelLogout() {
    hideLogoutModal();
    console.log('Logout cancelled by user');
}

// Confirm logout
function confirmLogout() {
    console.log('Logging out...');
    // Clear user data from localStorage
    localStorage.removeItem('userFirstName');
    // Redirect to login page
    window.location.href = '../login/index.html';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('logoutModal');
    if (event.target === modal) {
        hideLogoutModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideLogoutModal();
        hideProfileModal();
        closeSettingsModal();
    }
});

// ===== PROFILE MODAL FUNCTIONS =====

// Show profile modal
function showProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.add('active');
    loadProfileData();
}

// Hide profile modal
function hideProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('active');
}

// Close profile modal
function closeProfileModal() {
    hideProfileModal();
}

// Load profile data from localStorage (from login process)
function loadProfileData() {
    try {
        // Get user data from localStorage (stored during login)
        const firstName = localStorage.getItem('userFirstName') || 'User';
        const lastName = localStorage.getItem('userLastName') || '';
        const email = localStorage.getItem('userEmail') || 'user@example.com';
        const mobile = localStorage.getItem('userMobile') || '';
        const countryCode = localStorage.getItem('userCountryCode') || '';
        
        // Update profile display
        const fullName = `${firstName} ${lastName}`.trim();
        document.getElementById('profileFullName').textContent = fullName || 'User Name';
        document.getElementById('profileEmail').textContent = email;
        
        // Format phone number with country code
        const phone = countryCode && mobile ? 
            `+${countryCode} ${mobile}` : 
            (mobile || 'Not provided');
        document.getElementById('profileMobile').textContent = phone;
        
        console.log('Profile data loaded from localStorage:', { firstName, lastName, email, mobile, countryCode });
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        loadFallbackProfileData();
    }
}

// Load fallback profile data when localStorage is not available
function loadFallbackProfileData() {
    const storedFirstName = localStorage.getItem('userFirstName');
    
    document.getElementById('profileFullName').textContent = storedFirstName || 'User Name';
    document.getElementById('profileEmail').textContent = 'user@example.com';
    document.getElementById('profileMobile').textContent = 'Not provided';
}



// ===== SETTINGS MODAL FUNCTIONS =====

// Show settings modal
function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('active');
    loadSettings();
}

// Hide settings modal
function hideSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('active');
}

// Close settings modal
function closeSettingsModal() {
    hideSettingsModal();
}

// Load current settings (all disabled)
function loadSettings() {
    // Settings are currently inactive
    console.log('Settings are disabled');
}



// ===== SETTINGS FUNCTIONS (DISABLED) =====

// All settings are currently disabled
function showSettingsDisabled() {
    alert('Settings are currently inactive. Coming soon!');
}

// ===== INITIALIZATION =====


