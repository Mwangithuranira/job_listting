document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.getElementById('job-listings');
    const filterContainer = document.getElementById('filter-container');
    const filters = new Set();

    // Fetch data from local data.json file
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const jobs = data;
            renderJobs(jobs);
            addFilterListeners(jobs);
        })
        .catch(error => console.error('Error fetching job listings:', error));

    function renderJobs(jobs) {
        jobListingsContainer.innerHTML = '';
        const filteredJobs = jobs.filter(job => {
            if (filters.size === 0) return true;
            const allTags = [job.role, job.level, ...job.languages, ...job.tools];
            return Array.from(filters).every(filter => allTags.includes(filter));
        });

        filteredJobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.className = 'job-listing';
            jobElement.innerHTML = `
                <div class="job-header">
                    <img src="${job.logo}" alt="${job.company} logo" class="company-logo">
                    <span class="company">${job.company}</span>
                    ${job.new ? '<span class="new">New!</span>' : ''}
                    ${job.featured ? '<span class="featured">Featured</span>' : ''}
                </div>
                <h2 class="position">${job.position}</h2>
                <div class="job-info">
                    <span class="posted-at">${job.postedAt}</span>
                    <span class="contract">${job.contract}</span>
                    <span class="location">${job.location}</span>
                </div>
                <div class="job-tags">
                    <span class="role">${job.role}</span>
                    <span class="level">${job.level}</span>
                    ${job.languages.map(lang => `<span class="language">${lang}</span>`).join('')}
                    ${job.tools.map(tool => `<span class="tool">${tool}</span>`).join('')}
                </div>
            `;
            jobListingsContainer.appendChild(jobElement);
        });
    }

    function renderFilters() {
        filterContainer.innerHTML = '';
        filters.forEach(filter => {
            const filterElement = document.createElement('div');
            filterElement.className = 'filter';
            filterElement.textContent = filter;
            filterElement.addEventListener('click', () => {
                filters.delete(filter);
                renderFilters();
                fetch('./data.json')
                    .then(response => response.json())
                    .then(data => {
                        renderJobs(data);
                    });
            });
            filterContainer.appendChild(filterElement);
        });
    }

    function addFilterListeners(jobs) {
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('language') ||
                event.target.classList.contains('role') ||
                event.target.classList.contains('level') ||
                event.target.classList.contains('tool')) {
                const filter = event.target.textContent;
                filters.add(filter);
                renderFilters();
                renderJobs(jobs);
            }
        });
    }
});

  