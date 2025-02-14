document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', async (event) => {
      const checkbox = event.target;
      const card = checkbox.closest('.card');
      const id = card.dataset.key;
      const title = card.querySelector('h2').innerText;
      const newStatus = checkbox.checked ? 'completed' : 'inProgress';

      console.log(`Updating todo with id: ${id}, title: ${title}, status: ${newStatus}`);

      try {
        const response = await fetch(`http://localhost:8080/todos?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, title, status: newStatus }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to update status: ${response.status} ${response.statusText} - ${errorText}`);
          throw new Error('Failed to update status');
        }

        console.log('Status updated successfully');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    });
  });
});
