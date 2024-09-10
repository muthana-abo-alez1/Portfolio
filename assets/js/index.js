document.addEventListener('DOMContentLoaded', () => {
    function updateActiveSection(hash) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });

        document.querySelectorAll('.sidebar a').forEach(link => {
            link.classList.remove('active-link');
        });

        const activeSection = document.querySelector(hash);
        const activeLink = document.querySelector(`.sidebar a[href="${hash}"]`);

        if (activeSection) {
            activeSection.classList.add('active-section');
        }

        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    }

    function handleHashChange() {
        const currentHash = window.location.hash || '#home';
        updateActiveSection(currentHash);
    }

    function getSectionInView() {
        const sections = document.querySelectorAll('.home, .about, .projects, .education, .contact');
        let inViewSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                inViewSection = section;
            }
        });

        return inViewSection;
    }

    function updateUrl() {
        const section = getSectionInView();
        if (section) {
            const id = section.getAttribute('id');
            if (id && window.location.hash !== '#' + id) {
                history.replaceState(null, null, '#' + id);
                updateActiveSection('#' + id);
            }
        }
    }

    function scrollToHash() {
        const hash = window.location.hash;
        if (hash) {
            const section = document.querySelector(hash);
            if (section) {
                section.scrollIntoView({ behavior: 'auto' });
                updateActiveSection(hash);
            }
        }
    }

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    scrollToHash();
    handleHashChange();

    window.addEventListener('scroll', throttle(updateUrl, 200));
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', scrollToHash);

    document.querySelectorAll('.sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'auto' });
                history.replaceState(null, null, targetId); 
                updateActiveSection(targetId);
            }
        });
    });
});

function handleScrollLine() {
    const scrollLine = document.querySelector(".scroll-line");
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  
    window.addEventListener("scroll", function () {
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / totalHeight) * 58;
  
      if (window.innerWidth > 925) {
        scrollLine.style.height = scrollPercent + "%";
      }
    });
  }
  
  function handleSidebarLinks() {
    const sections = document.querySelectorAll("section");
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
    const minWidth = 925;
    const defaultVisibilityThreshold = 0.75; 
    const educationVisibilityThreshold = 0.50; 

    const checkVisibility = () => {
        let activeSectionId = null;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height;
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const viewportHeight = window.innerHeight;

            const visibleHeight = Math.min(sectionBottom, viewportHeight) - Math.max(sectionTop, 0);
            const visiblePercentage = (visibleHeight / sectionHeight);
            const visibilityThreshold = section.id === 'education' ? educationVisibilityThreshold : defaultVisibilityThreshold;

            if (visiblePercentage >= visibilityThreshold) {
                activeSectionId = section.id;
            }
        });

        sidebarLinks.forEach((link) => {
            const sectionId = link.getAttribute("href").substring(1);
            if (activeSectionId === sectionId && window.innerWidth > minWidth) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    checkVisibility();
}

  document.addEventListener("DOMContentLoaded", function () {
    handleScrollLine();
    handleSidebarLinks();
  });
  

