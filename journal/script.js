let selectedSentiment = '';

function setSentiment(emoji) {
    selectedSentiment = emoji;
    alert(`You selected: ${emoji}`);
}

function saveEntry() {
    const entryText = document.getElementById('journalEntry').value;
    const entryDate = document.getElementById('entryDate').value;

    if (!entryText.trim()) {
        alert('Please write something before saving.');
        return;
    }

    if (!entryDate) {
        alert('Please select a date.');
        return;
    }

    if (!selectedSentiment) {
        alert('Please select your sentiment.');
        return;
    }

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push({ text: entryText, date: entryDate, sentiment: selectedSentiment });
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    document.getElementById('journalEntry').value = '';
    document.getElementById('entryDate').value = '';
    selectedSentiment = '';
    closeModal();
    displayEntries();
}

function openModal() {
    document.getElementById('entryModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('entryModal').style.display = 'none';
}

function groupEntriesByMonth(entries) {
    return entries.reduce((groups, entry) => {
        const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(entry);
        return groups;
    }, {});
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const groupedEntries = groupEntriesByMonth(entries);
    const entriesContainer = document.getElementById('entries');
    entriesContainer.innerHTML = '';

    Object.keys(groupedEntries)
        .sort((a, b) => new Date(b) - new Date(a)) // Reverse chronological order
        .forEach(month => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month-group';

            const monthHeader = document.createElement('button');
            monthHeader.className = 'accordion';
            monthHeader.textContent = month;
            monthHeader.onclick = function () {
                const panel = this.nextElementSibling;
                panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            };

            const monthPanel = document.createElement('div');
            monthPanel.className = 'panel';

            groupedEntries[month].forEach((entry, index) => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'entry';
                entryDiv.innerHTML = `
                    <strong>${entry.date} - ${entry.sentiment}</strong>
                    <p>${entry.text}</p>
                    <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
                `;
                monthPanel.appendChild(entryDiv);
            });

            monthDiv.appendChild(monthHeader);
            monthDiv.appendChild(monthPanel);
            entriesContainer.appendChild(monthDiv);
        });
}

function expandAll() {
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.display = 'block';
    });
}

function collapseAll() {
    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.display = 'none';
    });
}

// Display entries on page load
displayEntries();