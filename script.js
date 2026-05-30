const LINKS = {
  k3Test: 'mailto:dr-dirk@dirkinstitute.org?subject=Anfrage%20300-Sekunden-Test%C2%AE',
  leseprobe: 'https://example.com/agentic-sovereignty-leseprobe',
  terminbuchung: 'https://terminbuchung-ten.vercel.app/',
};

const linkMap = {
  'k3-test': LINKS.k3Test,
  leseprobe: LINKS.leseprobe,
  terminbuchung: LINKS.terminbuchung,
};

document.querySelectorAll('[data-link]').forEach((el) => {
  const key = el.getAttribute('data-link');
  const target = linkMap[key];
  if (target) {
    el.setAttribute('href', target);
  }
});

const revealElements = Array.from(document.querySelectorAll('.reveal'));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 70}ms`;
  observer.observe(el);
});

const form = document.getElementById('terminanfrage-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = data.get('name');
    const unternehmen = data.get('unternehmen');
    const email = data.get('email');
    const anlass = data.get('anlass');
    const nachricht = data.get('nachricht');

    const subject = encodeURIComponent(`Terminanfrage ${anlass} - ${unternehmen}`);
    const body = encodeURIComponent(
      `Name: ${name}\nUnternehmen: ${unternehmen}\nE-Mail: ${email}\nAnlass: ${anlass}\n\nKurzbeschreibung:\n${nachricht}`
    );

    window.location.href = `mailto:dr-dirk@dirkinstitute.org?subject=${subject}&body=${body}`;
  });
}





