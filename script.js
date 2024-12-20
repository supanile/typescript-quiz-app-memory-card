"use strict";
// DOM Element selections with type assertions
const showBtn = document.getElementById('show');
const hiddenBtn = document.getElementById('btn-hidden');
const addContainer = document.getElementById('add-container');
const cardContainer = document.getElementById('card-container');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const currentEl = document.getElementById('current');
const clearBtn = document.getElementById('clear');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
// State variables
let currentActiveCard = 0;
let cardsEl = [];
const cardData = getCardData();
function createCard() {
    cardData.forEach((data, index) => {
        createSingleCard(data, index);
    });
}
function createSingleCard(data, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    if (index === 0) {
        card.classList.add('active');
    }
    card.innerHTML = `
    <div class="inner-card">
        <div class="inner-card-front">
            <p>${data.question}</p>
            <i class="fas fa-sync-alt flip-icon"></i>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
        <div class="inner-card-back">
            <p>${data.answer}</p>
            <i class="fas fa-sync-alt flip-icon"></i>
            <i class="fa-solid fa-trash delete-btn"></i>
        </div>
    </div>
    `;
    card.addEventListener('click', () => card.classList.toggle("show-answer"));
    const deleteBtns = card.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCard(index);
        });
    });
    cardsEl.push(card);
    cardContainer === null || cardContainer === void 0 ? void 0 : cardContainer.appendChild(card);
    updateCurrentQuestion();
}
function deleteCard(index) {
    cardData.splice(index, 1);
    setCardData(cardData);
    window.location.reload();
}
function updateCurrentQuestion() {
    if (currentEl) {
        currentEl.innerText = `${currentActiveCard + 1} / ${cardsEl.length}`;
    }
}
function updateCardPositions() {
    cardsEl.forEach((card, index) => {
        card.style.transform = `translateX(${100 * (index - currentActiveCard)}%) rotateY(0deg)`;
        card.style.opacity = index === currentActiveCard ? '1' : '0';
        card.style.zIndex = index === currentActiveCard ? '10' : '0';
    });
}
nextBtn.addEventListener('click', () => {
    if (currentActiveCard < cardsEl.length - 1) {
        currentActiveCard++;
        updateCardPositions();
        updateCurrentQuestion();
    }
});
prevBtn.addEventListener('click', () => {
    if (currentActiveCard > 0) {
        currentActiveCard--;
        updateCardPositions();
        updateCurrentQuestion();
    }
});
addCardBtn.addEventListener('click', () => {
    const question = (questionEl === null || questionEl === void 0 ? void 0 : questionEl.value) || '';
    const answer = (answerEl === null || answerEl === void 0 ? void 0 : answerEl.value) || '';
    if (question.trim() && answer.trim()) {
        const newCard = { question, answer };
        createSingleCard(newCard, cardsEl.length);
        if (questionEl)
            questionEl.value = '';
        if (answerEl)
            answerEl.value = '';
        if (addContainer) {
            addContainer.classList.remove('show');
        }
        cardData.push(newCard);
        setCardData(cardData);
        updateCardPositions();
        updateCurrentQuestion();
    }
});
function toggleAddContainer() {
    addContainer === null || addContainer === void 0 ? void 0 : addContainer.classList.toggle('show');
}
showBtn.addEventListener('click', toggleAddContainer);
hiddenBtn.addEventListener('click', toggleAddContainer);
function setCardData(cards) {
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
}
function getCardData() {
    const cards = JSON.parse(localStorage.getItem('cards') || '[]');
    return cards;
}
clearBtn.addEventListener('click', () => {
    localStorage.clear();
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }
    window.location.reload();
});
updateCardPositions();
createCard();
updateCardPositions();
window.addEventListener('resize', updateCardPositions);
