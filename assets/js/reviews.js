// /js/reviews.js

// Utility: Fisher–Yates shuffle in place
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Cache the fetched reviews so we only load once
let allReviews = null;

// Clears the two .cs-card-group ULs and injects six random 5-star reviews with comments
function displayRandomReviews(reviews) {
    // 1) Filter only FIVE-star reviews that have a non-empty comment
    const candidates = reviews
        .filter(r =>
            r.starRating === 'FIVE' &&
            typeof r.comment === 'string' &&
            r.comment.trim().length > 0
        )
        .slice(); // copy to avoid mutating original array

    // 2) Shuffle and take first 6
    shuffleArray(candidates);
    const picks = candidates.slice(0, 6);

    // 3) Grab the two UL placeholders
    const groups = document.querySelectorAll('#reviews-1672 .cs-card-group');

    // 4) Clear any existing items
    groups.forEach(ul => ul.innerHTML = '');

    // 5) Build and append each <li>
    picks.forEach((rev, i) => {
        const li = document.createElement('li');
        li.className = 'cs-item';
        li.innerHTML = `
        <div class="wrapper">
          <p class="cs-review">${rev.comment}</p>
          <img class="cs-item-stars"
               src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Graphics/yellow-stars.svg"
               alt="stars" width="96" height="16" aria-hidden="true" loading="lazy" decoding="async">
        </div>
        <div class="cs-flex-group">
          &mdash; <span class="cs-name">${rev.reviewer.displayName}</span>
        </div>
        <img class="cs-quote"
             src="https://csimg.nyc3.cdn.digitaloceanspaces.com/Images/Graphics/gray-quote.svg"
             alt="quote icon" width="120" height="99" aria-hidden="true" loading="lazy" decoding="async">
      `;
        // Decide which UL to append to: first 3 → groups[0], next 3 → groups[1]
        groups[Math.floor(i / 3)].appendChild(li);
    });
}

// Fetches reviews.json (once) and displays; on subsequent calls, just reshuffles
function fetchAndDisplay() {
    if (allReviews) {
        displayRandomReviews(allReviews);
        return;
    }

    fetch('/reviews.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            allReviews = data.reviews;
            displayRandomReviews(allReviews);
        })
        .catch(err => console.error('Failed to load reviews:', err));
}

// DOM-ready setup: initial load + button listener
document.addEventListener('DOMContentLoaded', () => {
    // 1) initial population
    fetchAndDisplay();

    // 2) wire up the refresh button
    const btn = document.getElementById('js-refresh-reviews');
    if (btn) {
        btn.addEventListener('click', fetchAndDisplay);
    }
});  