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

// Password validation for new entries
document.getElementById("adminForm").addEventListener("submit", function (event) {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password && confirmPassword && password !== confirmPassword) {
      event.preventDefault(); // Prevent form submission
      alert("Passwords do not match. Please check your entries.");
    }
  });

  function closePopup() {
    const popup = document.getElementById("newsletter-popup");
    if (popup) {
        popup.style.display = "none"; // Hide the popup
    }
}

// Function to toggle the visibility of the chatbot window
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotWindow.style.display = chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '' ? 'block' : 'none';
}

// Function to close the chatbot window
function closeChatbot() {
    document.getElementById('chatbot-window').style.display = 'none';
}

// Function to send message and display response
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return; // Prevent empty messages

    // Display user's message
    displayMessage(userInput, 'user');
    
    // Get bot's response
    const botResponse = getBotResponse(userInput);
    
    // Display bot's response
    setTimeout(() => {
        displayMessage(botResponse, 'bot');
        document.getElementById('user-input').value = ''; // Clear input field
    }, 1000);
}

// Function to display messages
function displayMessage(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
}

// Function to get bot's response based on the user's input (FAQ-based)
function getBotResponse(input) {
    const faq = {
        "What is the Turtle Shelter Project?": "The Turtle Shelter Project provides portable, lightweight vests to homeless individuals facing life-threatening cold. The vests unique capabilities help protect against hypothermia and frostbite.",
        "How can I donate?": "You can donate by visiting the 'Donate' page on our website.",
        "How can I volunteer?": "You can volunteer by visiting the 'Get Involved' page and signing up for upcoming events.",
        "Where are you located?": "Our headquarters are in Kaysville, Utah. You can contact us via the 'Contact Us' form for more details.",
        "What is the mission of the Turtle Shelter Project?": "Our mission is to provide immediate, life-saving shelter to homeless individuals in cold weather conditions, helping prevent hypothermia and frostbite.",
        "Why is this project important?": "Homelessness and extreme cold can be deadly. Our shelters provide a critical line of defense for people in need, offering warmth and protection in life-threatening conditions.",
        "What types of shelters do you provide?": "We provide lightweight, portable shelters designed to shield individuals from harsh weather conditions, particularly extreme cold.",
        "Who founded the Turtle Shelter Project?": "The Turtle Shelter Project was founded by Jen [Last Name] and a group of passionate individuals committed to addressing homelessness in cold climates.",
        "Why did Jen start the Turtle Shelter Project?": "Jen started the Turtle Shelter Project after seeing firsthand how harsh winter conditions affect homeless individuals. She wanted to create a simple but effective solution to protect people from hypothermia and frostbite.",
        "How did the founders come up with the idea for the shelter vests?": "Jen and the team spent time researching effective solutions for homeless individuals in cold weather and realized that traditional shelters were often difficult to carry or too expensive. The lightweight vest design emerged as an affordable and portable solution.",
        "Can I get in touch with the founders?": "While the founders are deeply involved in the project, the best way to contact them is through the 'Contact Us' page on our website. We will ensure your message is directed to the appropriate person.",
        "Can I host an event to raise awareness for the Turtle Shelter Project?": "Yes! We encourage community events and partnerships. Please reach out to us through the 'Get Involved' page to discuss how we can support your event.",
        "Can I hold an event outdoors to raise funds for the Turtle Shelter Project?": "Yes, you can host outdoor events. However, we recommend ensuring proper permits, safety precautions, and weather considerations are in place to ensure the success of your event.",
        "What is the maximum number of participants for an event?": "The maximum number of participants will vary depending on the event type and location. Please get in touch with us for more specific guidance based on the event you're planning.",
        "Is there a minimum number of volunteers or participants needed for an event?": "We recommend a minimum of 5-10 volunteers for smaller events to ensure we can meet our objectives. For larger events, we will provide further guidance based on your location and type of event.",
        "What kind of events does the Turtle Shelter Project organize?": "We organize fundraising events, awareness campaigns, volunteer opportunities, and educational events to share the mission of the Turtle Shelter Project.",
        "How can I organize a fundraising event for the Turtle Shelter Project?": "You can start by visiting our 'Get Involved' page and contacting our team. We will provide resources and guidance to help you create a successful fundraiser.",
        "Can I host a virtual event for the Turtle Shelter Project?": "Absolutely! Virtual events are a great way to raise awareness and funds. Please contact us, and we can help guide you through organizing a virtual fundraiser.",
        "Are there any upcoming events I can attend or participate in?": "Please visit our 'Events' page to see a list of upcoming events, fundraisers, and volunteer opportunities.",
        "What can I donate to the Turtle Shelter Project?": "We primarily accept financial donations, but we also welcome donations of clothing, blankets, or other cold-weather gear that can help homeless individuals in need.",
        "Can I donate supplies like tents or sleeping bags?": "While we appreciate all types of donations, we focus specifically on shelter vests that are designed for portability and warmth. However, your donations of general supplies will still help support our mission.",
        "Where does my donation go?": "Donations are used to produce and distribute Turtle Shelters, as well as to support our outreach programs, education efforts, and to sustain our operations.",
        "Is my donation tax-deductible?": "Yes, as a 501(c)(3) non-profit organization, all donations are tax-deductible. We will provide you with a receipt for your donation.",
        "How can I donate other than through the website?": "You can contact us directly if you wish to make a donation by check or if you have other donation options in mind. Visit our 'Contact Us' page for more information.",
        "How can I become a volunteer?": "You can sign up to volunteer by visiting the 'Get Involved' page on our website. You'll be able to choose from upcoming volunteer opportunities.",
        "What kind of volunteer opportunities are available?": "We have a range of volunteer opportunities, including helping at events, distributing shelter vests, and assisting with fundraising efforts.",
        "Can I volunteer remotely?": "Yes, remote volunteer opportunities are available. You can help by raising awareness, organizing virtual events, or assisting with online administrative tasks.",
        "Do I need any special skills to volunteer?": "No special skills are required to volunteer. We welcome volunteers of all backgrounds and offer training for specific roles when needed.",
        "How old do I have to be to volunteer?": "We welcome volunteers of all ages. However, volunteers under 18 may need to be accompanied by an adult for certain events or activities.",
        "Can I volunteer with a group or organization?": "Yes! We encourage group volunteer efforts. Please contact us to discuss how we can accommodate your group and make the most of your collective impact.",
        "How many volunteers are needed for an event?": "The number of volunteers needed will depend on the size of the event. For large events, we recommend at least 10-20 volunteers to ensure smooth operations.",
        "How effective are the shelter vests in extreme cold?": "The shelter vests are designed to retain body heat and protect against frostbite and hypothermia. They are highly effective in conditions where traditional shelters are impractical.",
        "Can the vests be used for both individuals and families?": "The vests are designed to be used by individuals. However, we are exploring options to provide larger shelters for families in the future.",
        "How do I receive a shelter vest if I need one?": "If you are in need of a shelter vest, please reach out through our 'Contact Us' page, and we will work with local shelters and outreach programs to ensure you receive one.",
        "Are the shelter vests reusable?": "Yes, the vests are durable and can be reused. However, we encourage recipients to take care of them to ensure maximum effectiveness.",
        "Can I purchase a shelter vest for someone in need?": "Yes, you can donate a shelter vest through our website or by contacting us directly to make specific arrangements."
    };

    // Search for a matching FAQ response
    const normalizedInput = input.trim().toLowerCase();
    for (let question in faq) {
        if (normalizedInput.includes(question.toLowerCase())) {
            return faq[question];
        }
    }

    // Default response if no match is found
    return "I'm sorry, I am haven't learned that in my training. Can you ask something else?";
}









