/* JustiPenal — compartir únicamente la URL canónica de producción. */
(() => {
  "use strict";
  const URL = "https://justipenal.andesnova.solutions/";
  const TITLE = "JustiPenal";
  const TEXT = "Herramientas jurídicas referenciales, normativa penal peruana, análisis de casos, cálculo de penas, plazos procesales y fuentes oficiales.";
  const dialog = document.querySelector("#share-dialog");
  const triggers = [...document.querySelectorAll("[data-share-open]")];
  if (!dialog || !triggers.length) return;

  const close = dialog.querySelector(".share-close");
  const native = dialog.querySelector(".share-native");
  const copy = dialog.querySelector("[data-share-copy]");
  const status = dialog.querySelector(".share-status");
  const whatsapp = dialog.querySelector("[data-share-whatsapp]");
  const facebook = dialog.querySelector("[data-share-facebook]");
  let returnFocus = null;

  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${TITLE} — ${TEXT} ${URL}`)}`;
  facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`;
  native.hidden = typeof navigator.share !== "function";

  function open(trigger) {
    returnFocus = trigger;
    status.textContent = "";
    dialog.showModal();
    requestAnimationFrame(() => (native.hidden ? whatsapp : native).focus());
  }

  function closeDialog() {
    dialog.close();
    returnFocus?.focus();
  }

  triggers.forEach((trigger) => trigger.addEventListener("click", () => open(trigger)));
  close.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    if (outside) closeDialog();
  });
  dialog.addEventListener("close", () => returnFocus?.focus());

  native.addEventListener("click", async () => {
    try {
      await navigator.share({ title: TITLE, text: TEXT, url: URL });
      closeDialog();
    } catch (error) {
      if (error?.name !== "AbortError") status.textContent = "Usa una de las opciones disponibles o copia el enlace.";
    }
  });

  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(URL);
    } catch {
      const field = document.createElement("textarea");
      field.value = URL;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    status.textContent = "Enlace copiado.";
  });
})();
