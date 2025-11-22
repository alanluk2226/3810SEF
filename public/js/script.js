
document.addEventListener('DOMContentLoaded', () => {
    console.log('Fitness App JS Loaded.');

    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            console.log('Delete button clicked. Server will process request.');
        });
    });
});
