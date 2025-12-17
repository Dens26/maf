document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-form");
  const countrySelect = document.querySelector('select[name="birthcountry"]');
  const departmentWrapper = document.getElementById("birthdepartment-wrapper");

  if (!form || !countrySelect || !departmentWrapper) return;

  // Afficher ou cacher le département
  const toggleDepartment = () => {
    if (countrySelect.value === "FR") {
      departmentWrapper.classList.remove("hidden", "opacity-0", "h-0");
      departmentWrapper.classList.add("opacity-100", "h-auto");
    } else {
      departmentWrapper.classList.add("opacity-0", "h-0");
      departmentWrapper.classList.remove("opacity-100", "h-auto");
      setTimeout(() => departmentWrapper.classList.add("hidden"), 300);
    }
  };

  // Vérification initiale
  toggleDepartment();

  // Détecter changement du pays
  countrySelect.addEventListener("change", toggleDepartment);

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Message envoyé avec succès !");
        form.reset();
        toggleDepartment(); // Masquer le département après reset
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau. Veuillez vérifier votre connexion.");
    }
  });
});
