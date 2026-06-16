const LINKS = {
  k3Test: 'mailto:dr-dirk@dr-dirkinstitute.org?subject=Anfrage%20Agency-Radius-Check',
  leseprobe: 'https://drive.google.com/file/d/1mtodaseULNFLNHyqWTcK-IJ6ss4U3n6b/view?usp=sharing',
  terminbuchung: 'https://terminbuchung-ten.vercel.app/',
  onepager: 'https://drive.google.com/file/d/1J7lSTzz60DhaYrTniKfcQm0hdtj6FaXG/view?usp=sharing',
};

const linkMap = {
  'k3-test': LINKS.k3Test,
  leseprobe: LINKS.leseprobe,
  terminbuchung: LINKS.terminbuchung,
  onepager: LINKS.onepager,
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

    window.location.href = `mailto:dr-dirk@dr-dirkinstitute.org?subject=${subject}&body=${body}`;
  });
}

const governanceCheckForm = document.getElementById('governance-check-form');
const scoreNumber = document.getElementById('score-number');
const scoreText = document.getElementById('score-text');
const checkerMailLink = document.getElementById('checker-mail-link');

if (governanceCheckForm && scoreNumber && scoreText) {
  const updateScore = () => {
    const answers = Array.from(governanceCheckForm.querySelectorAll('input[type="radio"]:checked'));
    const score = answers.reduce((sum, input) => sum + Number(input.value), 0);
    const total = governanceCheckForm.querySelectorAll('fieldset').length;
    const panel = scoreNumber.closest('.route-panel');

    scoreNumber.textContent = `${score}/${total}`;
    panel.classList.remove('score-low', 'score-medium', 'score-high');

    let message = 'Beantworten Sie die Fragen, um eine erste Einschätzung zu erhalten.';
    let level = 'offen';

    if (answers.length === total) {
      if (score <= 3) {
        message = 'Hoher Klärungsbedarf: Verantwortung, Nachweise oder Autonomiegrenzen sind noch nicht belastbar genug strukturiert.';
        level = 'hoher Klaerungsbedarf';
        panel.classList.add('score-low');
      } else if (score <= 5) {
        message = 'Teilweise belastbar: Es gibt Grundlagen, aber zentrale Governance- und Nachweisfragen sollten gezielt verdichtet werden.';
        level = 'teilweise belastbar';
        panel.classList.add('score-medium');
      } else {
        message = 'Gute Ausgangslage: Die Organisation wirkt governance-bewusst, sollte Agency Radius und Nachweise dennoch fachlich prüfen.';
        level = 'gute Ausgangslage';
        panel.classList.add('score-high');
      }
    }

    scoreText.textContent = message;

    if (checkerMailLink) {
      const subject = encodeURIComponent(`Schnellcheck-Auswertung ${score}/${total}`);
      const body = encodeURIComponent(
        `Hallo Dr. Dirk Kötting,\n\nwir möchten den EU AI Act und Governance-Ready Schnellcheck auswerten.\n\nErgebnis: ${score}/${total}\nEinschätzung: ${level}\n\nBitte melden Sie sich zur kurzen Einordnung.\n`
      );
      checkerMailLink.href = `mailto:dr-dirk@dr-dirkinstitute.org?subject=${subject}&body=${body}`;
    }
  };

  governanceCheckForm.addEventListener('change', updateScore);
  updateScore();
}

