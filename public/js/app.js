// app.js

document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    // Show the current slide
    function updateCarousel() {
        const offset = -currentSlide * 100;
        document.querySelector('.carousel-container').style.transform = `translateX(${offset}%)`;
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners for next/prev buttons
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    }

    // Optionally, auto-advance the carousel every 5 seconds
    setInterval(nextSlide, 5000);
});

document.addEventListener('DOMContentLoaded', function () {
    // Array of image sources
    const images = [
        'images/turtleshelterproject_home.jpg',  // OG image
        'images/service_group.jpg',  // Image 1
        'images/service_group2.jpg',        // Image 2
        'images/service_group3.jpg',  // Image 3
        'images/service_group4.jpg',  // Image 4
        'images/service_group5.jpg',        // Image 5
        'images/service_group6.jpg',  // Image 6
        'images/service_group7.jpg',        // Image 7
        'images/service_group8.jpg'  // Image 8
    ];

    let currentIndex = 0;

    // Function to change the image with fade effect
    function changeImage() {
        const imageElement = document.getElementById('dynamic-image');
        
        // Start fading out the current image
        imageElement.style.opacity = 0;

        // Wait for the fade-out to finish (1s transition time) before changing the image
        setTimeout(() => {
            // Change the image source to the next one
            imageElement.src = images[currentIndex];

            // Fade it back in
            imageElement.style.opacity = 1;

            // Update the index, looping back to 0 if it's the last image
            currentIndex = (currentIndex + 1) % images.length;
        }, 1000);  // Wait for 1s (fade-out transition duration)
    }

    // Change the image every 3 seconds (3000ms) instead of 5
    setInterval(changeImage, 5000);

    // Call the function immediately to set the first image when the page loads
    changeImage();
});

document.addEventListener("DOMContentLoaded", function() {
    // Select the sponsors container and all the individual sponsor logos
    const container = document.querySelector('.sponsors-container');
    const logos = document.querySelectorAll('.sponsor-logo');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    // Ensure the logos and arrows are found
    if (container && logos.length > 0 && leftArrow && rightArrow) {
        // Duplicate logos to create a continuous effect
        const logoCount = logos.length;
        for (let i = 0; i < logoCount; i++) {
            const clone = logos[i].cloneNode(true);
            container.appendChild(clone);
        }

        // Adjust the animation time based on the number of logos for auto-scrolling
        const animationDuration = 20 * logoCount;  // Increase duration for more logos
        container.style.animationDuration = `${animationDuration}s`;

        // Manual scroll with arrow buttons
        const logoWidth = logos[0].offsetWidth + 20;  // Width of one logo + margin-right
        let scrollPosition = 0;

        // Function to scroll the container to the left
        function scrollLeft() {
            if (scrollPosition > 0) {
                scrollPosition -= logoWidth;
            } else {
                scrollPosition = (logos.length - 1) * logoWidth;  // Loop back to the last logo
            }
            container.style.transform = `translateX(-${scrollPosition}px)`;
        }

        // Function to scroll the container to the right
        function scrollRight() {
            if (scrollPosition < (logos.length - 1) * logoWidth) {
                scrollPosition += logoWidth;
            } else {
                scrollPosition = 0;  // Loop back to the first logo
            }
            container.style.transform = `translateX(-${scrollPosition}px)`;
        }

        // Add event listeners for the arrows
        leftArrow.addEventListener('click', scrollLeft);
        rightArrow.addEventListener('click', scrollRight);
    }
});

// app.js

// app.js
document.addEventListener('DOMContentLoaded', function () {
    // Get the hamburger icon and sidebar
    const sidebarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');

    // Toggle sidebar when the hamburger icon is clicked
    sidebarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('active'); // Toggle the visibility of the sidebar
    });

    // Close the sidebar when the close button (×) is clicked
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        sidebar.classList.remove('active'); // Close the sidebar
    });
});

// Function to toggle the visibility of the logout option with fade-in effect
function toggleLogout() {
    const logoutOption = document.getElementById('logout-option');
    logoutOption.classList.toggle('show');
}

// Function to handle the logout and redirect to index.ejs
function logout() {
    window.location.href = '/';  // Assuming '/' corresponds to your index.ejs page
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners to all FAQ questions
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling; // Get the associated answer (faq-answer)
            const arrow = this.querySelector('.arrow'); // Get the arrow inside the question

            // Toggle the visibility of the answer and the rotation of the arrow
            answer.classList.toggle('open');
            arrow.classList.toggle('open');
        });
    });
});

document.querySelector('form').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        event.preventDefault();
        alert("Username and password are required.");
    }
});





