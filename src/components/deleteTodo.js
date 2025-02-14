document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      try {
        const response = await fetch(`http://localhost:8080/todos?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('The todo is deleted');
          const card = document.querySelector(`.card[data-key="${id}"]`);
          if (card) {
            card.remove();
          }
        } else {
          alert('Failed to delete the todo');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the todo');
      }
    });
  });
});
