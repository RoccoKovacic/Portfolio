document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        
        // Change icon based on menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('header nav a, .mobile-nav a');
  
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          // Only if the href attribute starts with #
          if (this.getAttribute('href').startsWith('#')) {
              e.preventDefault();
              
              const targetId = this.getAttribute('href');
              const targetSection = document.querySelector(targetId);
              
              if (targetSection) {
                  // Close mobile menu if open
                  if (mobileNav && mobileNav.classList.contains('active')) {
                      mobileNav.classList.remove('active');
                      const icon = mobileMenuBtn.querySelector('i');
                      icon.classList.remove('fa-times');
                      icon.classList.add('fa-bars');
                  }
                  
                  // Scroll to the section
                  window.scrollTo({
                      top: targetSection.offsetTop - 80, // Adjust for header height
                      behavior: 'smooth'
                  });
                  
                  // Update active link
                  navLinks.forEach(navLink => {
                      navLink.classList.remove('active');
                  });
                  
                  this.classList.add('active');
              }
          }
      });
  });
  
  // Throttle function to limit how often a function can run
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Update active nav link on scroll (throttled)
  const updateActiveNavLink = throttle(function() {
      const scrollPosition = window.scrollY;
      
      // Get all sections
      const sections = document.querySelectorAll('section');
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          const sectionId = section.getAttribute('id');
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              // Remove active class from all links
              navLinks.forEach(link => {
                  link.classList.remove('active');
              });
              
              // Add active class to corresponding links
              const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
              activeLinks.forEach(link => {
                  link.classList.add('active');
              });
          }
      });
  }, 100); // Run at most every 100ms
  
  window.addEventListener('scroll', updateActiveNavLink);
  
  // Use Intersection Observer for animations instead of scroll events
  const skillTags = document.querySelectorAll('.skill-tag');
  
  // Set initial state for skill tags
  if (skillTags.length > 0) {
    skillTags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animations but with a more efficient approach
          const delay = Math.min(index * 30, 300); // Cap the maximum delay
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          
          // Once the animation is done, unobserve the element
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // Use the viewport
      rootMargin: '0px',
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Observe each skill tag
    skillTags.forEach(tag => {
      observer.observe(tag);
    });
  }

  // Use Intersection Observer for certification cards
  const certificationCards = document.querySelectorAll('.certification-card');

  // Set initial state for certification cards
  if (certificationCards.length > 0) {
    certificationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });

    // Create an Intersection Observer for certification cards
    const certObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          
          // Once the animation is done, unobserve the element
          certObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    // Observe each certification card
    certificationCards.forEach(card => {
      certObserver.observe(card);
    });
  }

  // Image Modal Functionality
  const modal = document.getElementById('imageModal');
  if (modal) { // Check if modal exists on the page
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-modal');
    
    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Function to open modal
    function openModal(imgSrc, caption) {
      modalImg.src = imgSrc;
      modalCaption.textContent = caption || '';
      
      // Show modal with animation
      modal.style.display = 'flex';
      setTimeout(() => {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
      }, 10);
    }
    
    // Function to close modal
    function closeModal() {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }, 300);
    }
    
    // Add click event to all gallery images
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const captionEl = this.querySelector('.gallery-caption');
        const caption = captionEl ? captionEl.textContent : '';
        openModal(img.src, caption);
      });
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });
  }
});