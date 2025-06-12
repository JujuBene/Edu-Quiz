
let flashcards = [];
let currentCard = 0;
let hintsRemaining = 3;
let revealedLetters = [];
let score = 0; // Inicializa a pontuação
let hintsUsed = 0; // Conta quantas dicas foram usadas


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


// Exibir tela de Pré-definições
document.getElementById("backToPreDefinitionsButton").addEventListener("click", () => {
    document.getElementById("scoreCount").textContent = 0;
    // Oculta a tela principal
    document.getElementById("categoryGameScreen").classList.add("hidden");
    // document.getElementById("categoryGameScreen").style.visibility = "hidden";

    // Exibe a tela de pré-definições
    document.getElementById("preDefinitionsScreen").classList.remove("hidden");

});





function hideAllScreens() {
    document.getElementById("titleContainer").classList.add("hidden");
    document.getElementById("preDefinitionsScreen").classList.add("hidden");
    document.getElementById("customizeModal").classList.add("hidden");
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("categoryGameScreen").classList.add("hidden"); // Agora oculta o modo de jogo das categorias
    document.getElementById("endScreen").classList.add("hidden");
}

// Função para iniciar o jogo da categoria selecionada
function startCategoryGame(categoryName, questions) {
    hideAllScreens(); // Oculta todas as telas
    document.getElementById("categoryGameScreen").classList.remove("hidden"); // Exibe a tela de jogo da categoria
    // document.getElementById("categoryGameScreen").style.visibility = "visible"; // Exibe a tela de jogo da categoria
    // document.getElementById("categoryGameScreen").style.visibility = "visible"; // Exibe a tela de jogo da categoria


    document.getElementById("categoryGameTitle").innerText = `Categoria: ${categoryName}`; // Define o título
    currentCard = 0; // Reinicia o índice das perguntas
    console.log('questions:', questions);

    flashcards = shuffleArray([...questions.questions]); // Define as perguntas da categoria



    revealedLetters = Array(flashcards[currentCard].answer.length).fill("_"); // Define os traços
    resetCategoryHints(); // Reinicia as dicas
    loadCategoryCard(); // Carrega a primeira pergunta
}


async function consultQuestions(category) {
    try {
        const response = await fetch(`https://apiedugame-1.onrender.com/category/${category}`);
        if (!response.ok) throw new Error("Erro ao buscar categoria");

        const categoryData = await response.json(); // Adicione `await` aqui!
        return categoryData; // Retorne os dados
    } catch (error) {
        console.error('Erro ao consultar a categoria: ', error);
        throw error;
    }
}

// Embaralhar as questões do jogo
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Atualizar a pontuação na tela
function updateScore() {
    document.getElementById("scoreCount").innerText = score;
}








// Reiniciar o número de dicas
function resetCategoryHints() {
    hintsRemaining = 3;
    document.getElementById("categoryHintButton").innerText = `Dica (${hintsRemaining} restantes)`;
}

// Carregar a pergunta atual
function loadCategoryCard() {
    const card = flashcards[currentCard];
    document.getElementById("categoryGameDescription").innerText = card.description;
    document.getElementById("categoryGuessInput").value = "";
    updateCategoryAnswerPlaceholder();
}

// Atualizar os tracinhos da resposta
function updateCategoryAnswerPlaceholder() {
    document.getElementById("categoryAnswerPlaceholder").innerText = revealedLetters.join(" ");
}


function resetCategoryPredefinition() {
    resetCategoryHints(); // Reinicia as dicas
    loadCategoryCard(); // Carrega a primeira pergunta
}

// Recomeçando o jogo
document.getElementById("restartCategoryGame").addEventListener("click",async () => {
    score=0
    document.getElementById("scoreCount").textContent = 0;
    let category = document.getElementById("categoryGameTitle").textContent.split(': ')
    const questions = await consultQuestions(category[1]);
    startCategoryGame(category[1],questions);

});


// Dar dicas durante o jogo
document.getElementById("categoryHintButton").addEventListener("click", () => {
    if (hintsRemaining > 0) {
        const answer = flashcards[currentCard].answer;
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * answer.length);
        } while (revealedLetters[randomIndex] !== "_");

        revealedLetters[randomIndex] = answer[randomIndex];
        hintsRemaining--;
        hintsUsed++; // Registra dica usada

        document.getElementById("categoryHintButton").innerText = `Dica (${hintsRemaining} restantes)`;
        updateCategoryAnswerPlaceholder();
    } else {
        alert("Sem mais dicas!");
    }
});

// Submeter a resposta na categoria
document.getElementById("submitCategoryGuess").addEventListener("click", async () => {
    let category = document.getElementById("categoryGameTitle").textContent.split(': ')[1]
    const answer = await consultQuestions(category)
    const guess = document.getElementById("categoryGuessInput").value.trim();
    let descriptiongame = document.getElementById("categoryGameDescription").textContent.toLowerCase()
    console.log(`descrição é ${descriptiongame}`)
    const correctAnswer = answer.questions.find(q => q.description.toLowerCase() === descriptiongame)?.answer;
    console.log(correctAnswer)
    console.log(answer)
    document.getElementById("categoryGuessInput").focus();
    if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
        score += calculatePoints(); // Soma pontos corretamente
        updateScore();
        hintsUsed = 0;
        currentCard++;
        resetHintsCategory();
        if (currentCard < flashcards.length) {
            revealedLetters = Array(flashcards[currentCard].answer.length).fill("_");
            loadCategoryCard();
        } else {

            endGame(false)
            // alert("Parabéns! Você completou todas as perguntas.");
            // document.getElementById("backToCategories").click();
        }
    } else {
        alert("Tente novamente!");
    }
});

// Iniciar jogo ao clicar nos botões de categoria
document.querySelectorAll(".categories-buttons button").forEach(button => {
    button.addEventListener("click", async () => {
        const category = button.innerText;
        try {
            const questions = await consultQuestions(category);
            startCategoryGame(category, questions);
        } catch (error) {
            alert("Erro ao iniciar a categoria. Tente novamente.");
            console.error(error);
        }
    });
});



// Aqui é onde a juliana colocou o codigo.


// Função para calcular pontos com base nas dicas usadas
function calculatePoints() {
    if (hintsUsed === 0) return 30; // Sem dicas
    if (hintsUsed === 1) return 20; // Usou 1 dica
    if (hintsUsed === 2) return 10; // Usou 2 dicas
    return 0; // Usou todas as dicas
}




// Reiniciar jogo após ver pontuação final
function restartGameFinal() {
    score = 0; // Resetar pontuação
    updateScore();
    // location.reload();
};






// Voltar ao menu principal
document.getElementById("backToMenu").addEventListener("click", () => {
    // Oculta a tela de pré-definições
    document.getElementById("preDefinitionsScreen").classList.add("hidden");
    document.getElementById("customizeModal").classList.add("hidden");

    // Exibe a tela principal novamente
    document.getElementById("titleContainer").classList.remove("hidden");
});

// Voltar ao menu principal Customize
document.getElementById("backToMenuCustomize").addEventListener("click", () => {
    // Oculta a tela de pré-definições
    document.getElementById("customizeModal").classList.remove("show");
    document.getElementById("customizeModal").classList.add("hidden");

    // Exibe a tela principal novamente
    document.getElementById("titleContainer").classList.remove("hidden");
    // document.getElementById("titleContainer").classList.add("show");
});


// Abrir tela de Personalização
document.getElementById("customizeButton").addEventListener("click", () => {
    // Oculta a tela principal
    document.getElementById("titleContainer").classList.add("hidden");


    // Exibe o modal de personalização
    const customizeModal = document.getElementById("customizeModal");
    customizeModal.classList.remove("hidden");
    //customizeModal.classList.add("show");
});

// Abrir tela de Ajuda
document.getElementById("helpButton").addEventListener("click", () => {
    document.getElementById("helpModal").style.display = "block";
    document.getElementById("helpModal").style.visibility = "visible";
    document.getElementById("categoryGameScreen").style.position = " ";

    // document.getElementById("categoryGameScreen").style.visibility ="hidden";


});

// Fechar tela de Ajuda
document.getElementById("closeHelp").addEventListener("click", () => {
    document.getElementById("helpModal").style.visibility = "hidden";
    document.getElementById("helpModal").style.display = "none";
    // document.getElementById("categoryGameScreen").style.visibility = "visible";
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

        startGame(true);
    }
});

// Recomeçar Jogo
document.getElementById("restartDuringGame").addEventListener("click", () => {
    location.reload();
});




// Função para iniciar o jogo

function startGame(won) {
    currentCard = 0;
    revealedLetters = Array(flashcards[currentCard].answer.length).fill("_");
    resetHints();

    let endScreen = won ? "endScreen" : "CategoryEndScreen"
    let gameScreen = won ? "gameScreen" : "categoryGameScreen"


    console.log(endScreen)
    console.log(gameScreen)
    // document.getElementById(gameScreen).style.visibility="visible";
    document.getElementById(gameScreen).classList.remove("hidden");
    document.getElementById(gameScreen).style.visibility = "visible";
    document.getElementById(endScreen).classList.add("hidden");

    won ? loadCard() : loadCategoryCard();


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
// Reiniciar número de dicas categorias
function resetHintsCategory() {
    hintsRemaining = 3;
    document.getElementById("categoryHintButton").innerText = `Dica (${hintsRemaining} restantes)`;
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
        hintsUsed++; // Registra dica usada

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
        score += calculatePoints(); // Soma pontos com base nas dicas usadas
        updateScore();
        hintsUsed = 0; // Reseta a contagem de dicas
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
    let screen = won ? "gameScreen" : "categoryGameScreen"
    let screenEndgame = won ? "endScreen" : "CategoryEndScreen"
    finalScore = won ? "finalScore" : "CategoryfinalScore"

    hideAllScreens();
    document.getElementById(screen).classList.add("hidden");
    won ? null : document.getElementById(screen).style.visibility = "hidden"
    document.getElementById(screenEndgame).classList.remove("hidden");
    document.getElementById(finalScore).innerText = score;

    restartGameFinal()
    // document.getElementById("endMessage").innerText = won ? "Parabéns, você venceu!" : "Fim de Jogo!";
}

// Jogar Novamente
document.getElementById("playAgain").addEventListener("click", () => {
    startGame(true);
});
document.getElementById("CategoryplayAgain").addEventListener("click", () => {
    startGame(false);
    startGame(true);
});
document.getElementById("CategoryplayAgain").addEventListener("click", () => {
    startGame(false);
});

// Recarregar para reinício completo
document.getElementById("CategoryrestartGame").addEventListener("click", () => {
    location.reload();
});
// Recarregar para reinício completo
document.getElementById("restartGame").addEventListener("click", () => {
    location.reload();
});