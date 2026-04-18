/**
 * IntersectionObserver-driven reveal animations.
 * Add `.reveal` or `.stagger` to elements; this hooks them up.
 */

let observer;

export function initReveal() {
  if (observer) observer.disconnect();

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal, .stagger").forEach((el) => el.classList.add("in-view"));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Trigger skill-bar fills
          entry.target.querySelectorAll(".skill-bar-fill[data-fill]").forEach((bar) => {
            bar.style.width = `${bar.dataset.fill}%`;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".reveal, .stagger").forEach((el) => observer.observe(el));
}
