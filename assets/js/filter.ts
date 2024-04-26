document.addEventListener('DOMContentLoaded', () => {
  setupFilter();
});

function setupFilter() {
  const filters = document.querySelectorAll('.filter');

  filters.forEach((el) =>
    el.addEventListener('click', (event) => {
      // Remove 'active' class from all filters
      document
        .querySelectorAll('.filter')
        .forEach((el) => el.classList.remove('active'));

      // Set current filter active
      (event.target as HTMLElement).classList.add('active');
      applyFilter((event.target as HTMLElement).dataset.filter ?? '');
    })
  );

  function applyFilter(filter: string) {
    document.querySelectorAll('.filter-item').forEach((el) => {
      const elementFilters = (el as HTMLElement).dataset.filters
        ?.split(',')
        .filter((el) => el);

      if (filter === 'all' || elementFilters?.includes(filter)) {
        el.classList.remove('soft-hide');
      } else {
        el.classList.add('soft-hide');
      }
    });
  }
}
