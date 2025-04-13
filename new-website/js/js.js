        // Update year in footer
        document.getElementById('year').textContent = new Date().getFullYear();
    
        // Counting animation function
        function animateCount(element, target, prefix = '', suffix = '') {
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                element.textContent = prefix + Math.floor(current) + suffix;
            }, 30);
        }
    
        // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Menu toggle
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.querySelector('.nav-links');
            
            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    
                    // Toggle body overflow to prevent scrolling when menu is open
                    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
                });
                
                // Close menu when clicking on a link
                document.querySelectorAll('.nav-link, .btn-premium').forEach(link => {
                    link.addEventListener('click', () => {
                        menuToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });
            }
    
            // Start counting animations
            const serversCount = document.getElementById('servers-count');
            const usersCount = document.getElementById('users-count');
            const uptimeCount = document.getElementById('uptime-count');
    
            if (serversCount && usersCount && uptimeCount) {
                serversCount.classList.add('counting');
                usersCount.classList.add('counting');
                uptimeCount.classList.add('counting');
    
                animateCount(serversCount, 58, '+');
                animateCount(usersCount, 80413, '+');
                usersCount.textContent += 'K';
                animateCount(uptimeCount, 99.9, '', '%');
            }
        });
    
        // Initialize Discord widget
        if (typeof discordInvite !== 'undefined') {
            discordInvite.init({
                inviteCode: 'xqQCHk5JwU',
                title: 'ZuruBot Support Server',
                introText: 'Join our community:',
                joinText: 'Join Server',
                joinedText: 'Joined',
                width: '100%'
            });
            discordInvite.render();
        }