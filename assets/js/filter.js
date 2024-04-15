function setupFilter() {
  const filters = document.querySelectorAll('.filter');

  filters.forEach((el) =>
    el.addEventListener('click', (event) => {
      // Remove 'active' class from all filters
      document
        .querySelectorAll('.filter')
        .forEach((el) => el.classList.remove('active'));

      // Set current filter active
      event.target.classList.add('active');
      applyFilter(event.target.dataset.filter);
    })
  );

  function applyFilter(filter) {
    document.querySelectorAll('.filter-item').forEach((el) => {
      const elementFilters = el.dataset.filters.split(',').filter((el) => el);

      if (filter === 'all' || elementFilters.includes(filter)) {
        el.classList.remove('soft-hide');
      } else {
        el.classList.add('soft-hide');
      }
    });
  }
}
