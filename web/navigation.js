// Example event listener to show block ID when clicked
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
      alert("Selected block ID: " + item.dataset.blockId);
    });
  });
});
