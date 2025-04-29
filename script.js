let flashcards = [];
let currentCard = 0;
let hintsRemaining = 3;
let revealedLetters = [];

// Ocultar telas extras ao carregar a página
window.onload = () => {
    document.getElementById("preDefinitionsScreen").classList.add("hidden");
    document.getElementById("customizeModal").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("endScreen").classList.add("hidden");
};

// Exibir tela de Pré-definições
document.getElementById("preDefinitionsButton").addEventListener("click", () => {
    // Oculta a tela principal
    document.getElementById("titleContainer").classList.add("hidden");

    // Exibe a tela de pré-definições
    document.getElementById("preDefinitionsScreen").classList.remove("hidden");
});

// Voltar ao menu principal
document.getElementById("backToMenu").addEventListener("click", () => {
    // Oculta a tela de pré-definições
    document.getElementById("preDefinitionsScreen").classList.add("hidden");

    // Exibe a tela principal novamente
    document.getElementById("titleContainer").classList.remove("hidden");
});

// Abrir tela de Personalização
document.getElementById("customizeButton").addEventListener("click", () => {
    // Oculta a tela principal
    document.getElementById("titleContainer").classList.add("hidden");

    // Exibe o modal de personalização
    const customizeModal = document.getElementById("customizeModal");
    customizeModal.classList.remove("hidden");
    customizeModal.classList.add("show");
});

// Abrir tela de Ajuda
document.getElementById("helpButton").addEventListener("click", () => {
    document.getElementById("helpModal").style.display = "block";
});

// Fechar tela de Ajuda
document.getElementById("closeHelp").addEventListener("click", () => {
    document.getElementById("helpModal").style.display = "none";
});

// Adicionar Flashcard
document.getElementById("addFlashcard").addEventListener("click", () => {
    const flashcardsDiv = document.getElementById("flashcards");

    const flashcardContainer = document.createElement("div");
    flashcardContainer.className = "flashcard-container";

    const descriptionWrapper = document.createElement("div");
    descriptionWrapper.className = "input-wrapper";

    const descriptionInput = document.createElement("input");
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", "Descrição");
    descriptionInput.className = "description-input";

    descriptionWrapper.appendChild(descriptionInput);

    const answerWrapper = document.createElement("div");
    answerWrapper.className = "input-wrapper";

    const answerInput = document.createElement("input");
    answerInput.setAttribute("type", "text");
    answerInput.setAttribute("placeholder", "Resposta");
    answerInput.className = "answer-input";

    answerWrapper.appendChild(answerInput);

    const removeButton = document.createElement("button");
    removeButton.className = "removeFlashcard";
    removeButton.innerText = "✖";

    removeButton.addEventListener("click", () => {
        flashcardsDiv.removeChild(flashcardContainer);
    });

    flashcardContainer.appendChild(descriptionWrapper);
    flashcardContainer.appendChild(answerWrapper);
    flashcardContainer.appendChild(removeButton);

    flashcardsDiv.appendChild(flashcardContainer);
});

// Iniciar Jogo
document.getElementById("startGame").addEventListener("click", () => {
    const descriptions = document.querySelectorAll(".description-input");
    const answers = document.querySelectorAll(".answer-input");

    flashcards = [];
    let hasEmptyFields = false;

    for (let i = 0; i < descriptions.length; i++) {
        const descriptionText = descriptions[i].value.trim();
        const answerText = answers[i].value.trim();

        if (descriptionText === "" || answerText === "") {
            hasEmptyFields = true;
            break;
        }

        flashcards.push({
            description: descriptionText,
            answer: answerText,
        });
    }

    if (hasEmptyFields) {
        alert("Por favor, preencha todas as descrições e respostas antes de começar!");
    } else {
        document.getElementById("customizeModal").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");

        startGame();
    }
});

// Recomeçar Jogo
document.getElementById("restartDuringGame").addEventListener("click", () => {
    location.reload();
});

// Função para iniciar o jogo
function startGame() {
    currentCard = 0;
    resetHints();
    revealedLetters = Array(flashcards[currentCard].answer.length).fill("_");

    document.getElementById("endScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    loadCard();
}

// Carregar Flashcard
function loadCard() {
    const card = flashcards[currentCard];
    document.getElementById("gameDescription").innerText = card.description;
    document.getElementById("guessInput").value = "";
    updateAnswerPlaceholder();
    resetHints();
}

// Reiniciar número de dicas
function resetHints() {
    hintsRemaining = 3;
    document.getElementById("hintButton").innerText = `Dica (${hintsRemaining} restantes)`;
}

// Atualizar traços ou letras reveladas
function updateAnswerPlaceholder() {
    document.getElementById("answerPlaceholder").innerText = revealedLetters.join(" ");
}

// Botão de Dicas
document.getElementById("hintButton").addEventListener("click", () => {
    if (hintsRemaining > 0) {
        const answer = flashcards[currentCard].answer;
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * answer.length);
        } while (revealedLetters[randomIndex] !== "_");

        revealedLetters[randomIndex] = answer[randomIndex];
        hintsRemaining--;

        document.getElementById("hintButton").innerText = `Dica (${hintsRemaining} restantes)`;
        updateAnswerPlaceholder();
    } else {
        alert("Sem mais dicas!");
    }
});

// Submeter Resposta
document.getElementById("submitGuess").addEventListener("click", () => {
    const guess = document.getElementById("guessInput").value.trim();
    const correctAnswer = flashcards[currentCard].answer;

    if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
        currentCard++;
        if (currentCard < flashcards.length) {
            revealedLetters = Array(flashcards[currentCard].answer.length).fill("_");
            loadCard();
        } else {
            endGame(true);
        }
    } else {
        alert("Tente novamente!");
    }
});

// Finalizar Jogo
function endGame(won) {
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("endScreen").classList.remove("hidden");
    document.getElementById("endMessage").innerText = won ? "Parabéns, você venceu!" : "Fim de Jogo!";
}

// Jogar Novamente
document.getElementById("playAgain").addEventListener("click", () => {
    startGame();
});

// Recarregar para reinício completo
document.getElementById("restartGame").addEventListener("click", () => {
    location.reload();
});
