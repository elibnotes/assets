
  const examCardsContainer = document.getElementById('examCardsContainer');
  const filterNameInput = document.getElementById('filterName');
  const filterYearSelect = document.getElementById('filterYear');
  const filterStandardSelect = document.getElementById('filterStandard');
  const filterPremiumSelect = document.getElementById('filterPremium');
  const filterAvailabilitySelect = document.getElementById('filterAvailability');

  // Function to create a single exam card HTML
  function createExamCard(exam) {
    const isComingSoon = exam.redirectLink === "";
    const cardLink = isComingSoon ? 'javascript:void(0)' : exam.redirectLink; // Use javascript:void(0) for "Coming Soon"
    const cardClass = `exam-card ${isComingSoon ? 'coming-soon' : ''}`;
    const buttonText = isComingSoon ? 'Coming Soon' : 'View Details';
    const buttonClass = `exam-card-button ${isComingSoon ? 'coming-soon-btn' : ''}`;
    const targetAttribute = isComingSoon ? '' : 'target="_blank" rel="noopener noreferrer"'; // Open external links in new tab

    return `
      <a href="${cardLink}" class="${cardClass}" ${targetAttribute}>
        ${exam.premium ? '<span class="premium-tag">Premium</span>' : ''}
        <div class="exam-card-image">
          ${exam.image ? `<img src="${exam.image}" alt="${exam.name} Image" style="width:100%; height:100%; object-fit:cover; border-radius: 12px 12px 0 0;">` : `<span>${exam.name.split(' ').map(n => n[0]).join('')}</span>`}
        </div>
        <div class="exam-card-content">
          <h3 class="exam-card-title">${exam.name}</h3>
          <p class="exam-card-detail"><strong>Year:</strong> ${exam.year}</p>
          <p class="exam-card-detail"><strong>Standard:</strong> ${exam.standard}</p>
          <div class="exam-card-actions">
            <span class="${buttonClass}">${buttonText}</span>
          </div>
        </div>
      </a>
    `;
  }

  // Function to render exam cards based on filtered data
  function renderExamCards(filteredData) {
    examCardsContainer.innerHTML = ''; // Clear existing cards
    if (filteredData.length === 0) {
      examCardsContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">No exams found matching your criteria.</p>';
      return;
    }
    filteredData.forEach(exam => {
      examCardsContainer.innerHTML += createExamCard(exam);
    });
  }

  // Function to populate filter options
  function populateFilters() {
    // Populate Years
    const years = [...new Set(DATA.map(exam => exam.year))].sort((a, b) => b - a);
    years.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      filterYearSelect.appendChild(option);
    });

    // Populate Standards
    const standards = [...new Set(DATA.map(exam => exam.standard))].sort();
    standards.forEach(standard => {
      const option = document.createElement('option');
      option.value = standard;
      option.textContent = standard;
      filterStandardSelect.appendChild(option);
    });
  }

  // Function to apply filters
  function applyFilters() {
    const nameFilter = filterNameInput.value.toLowerCase();
    const yearFilter = filterYearSelect.value;
    const standardFilter = filterStandardSelect.value;
    const premiumFilter = filterPremiumSelect.value;
    const availabilityFilter = filterAvailabilitySelect.value;

    let filteredExams = DATA.filter(exam => {
      // Filter by Name
      if (nameFilter && !exam.name.toLowerCase().includes(nameFilter)) {
        return false;
      }

      // Filter by Year
      if (yearFilter && exam.year.toString() !== yearFilter) {
        return false;
      }

      // Filter by Standard
      if (standardFilter && exam.standard !== standardFilter) {
        return false;
      }

      // Filter by Premium
      if (premiumFilter !== "") {
        if (premiumFilter === "true" && !exam.premium) {
          return false;
        }
        if (premiumFilter === "false" && exam.premium) {
          return false;
        }
      }

      // Filter by Availability
      if (availabilityFilter === "available" && exam.redirectLink === "") {
        return false;
      }
      if (availabilityFilter === "comingsoon" && exam.redirectLink !== "") {
        return false;
      }

      return true;
    });

    renderExamCards(filteredExams);
  }

  // Function to clear all filters
  function clearFilters() {
    filterNameInput.value = '';
    filterYearSelect.value = '';
    filterStandardSelect.value = '';
    filterPremiumSelect.value = '';
    filterAvailabilitySelect.value = '';
    applyFilters(); // Re-render with no filters
  }

  // Initial render when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    applyFilters(); // Render all cards initially
  });
