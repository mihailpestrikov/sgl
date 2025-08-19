document.addEventListener('DOMContentLoaded', function() {
  const typeButtons = document.querySelectorAll('.toggle-row:first-child .toggle-btn');
  const genderButtons = document.querySelectorAll('.toggle-row:last-child .toggle-btn');

  let activeType = 'teams';
  let activeGender = 'men';

  typeButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (button.classList.contains('active')) return;

      typeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      activeType = button.dataset.target;

      updateVisibleContent();
    });
  });

  genderButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (button.classList.contains('active')) return;

      genderButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      activeGender = button.dataset.target;

      updateVisibleContent();
    });
  });

  function updateVisibleContent() {
    document.querySelectorAll('.rating-section').forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${activeType}-${activeGender}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  updateVisibleContent();
});