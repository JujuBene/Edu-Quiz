categoriesButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const category = btn.textContent.trim();
    try {
      const res = await fetch(`https://eduquizz-api.onrender.com/category/${category}`);
      const data = await res.json();
      questions = data.questions;
      currentQuestionIndex = 0;
      score = 0;
      hintsUsed = 0;
      updateScore(0);
      showQuestion();
      preDefinitionsScreen.classList.add("hidden");
      categoryGameScreen.classList.remove("hidden");
    } catch (error) {
      alert("Erro ao carregar perguntas da categoria");
      console.error(error);
    }
  });
});