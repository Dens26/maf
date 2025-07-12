document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.interests = formData.getAll('interests');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Message envoyé avec succès.');
        form.reset();
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau. Veuillez vérifier votre connexion.");
    }
  });
});