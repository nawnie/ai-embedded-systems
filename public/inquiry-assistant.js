(() => {
  "use strict";

  const HOME_SEEN_KEY = "aes_home_seen_at";
  const DISMISSED_KEY = "aes_inquiry_guide_dismissed";
  const STATE_KEY = "aes_inquiry_guide_state_v1";
  const HOME_SEEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;
  const SHOW_DELAY_MS = 4500;
  const MAX_CLIENT_CALLS = 8;
  const MAX_STORED_MESSAGES = 12;
  const SOFTWARE_EMAIL = "sohagan.dev@aiembeddedsystems.com";
  const ROBOTICS_EMAIL = "robert@aiembeddedsystems.com";
  const GREETING = "You’ve been exploring our technical work. Want help turning what you need into a clear project inquiry? I’ll ask one question at a time.";

  const currentPath = normalizePath(window.location.pathname);

  if (currentPath === "/") {
    safeSessionSet(HOME_SEEN_KEY, String(Date.now()));
    return;
  }

  const homeSeenAt = Number(safeSessionGet(HOME_SEEN_KEY) || 0);
  const referredFromHome = isSameOriginHomepageReferrer(document.referrer);
  const hasRecentHomepageVisit = homeSeenAt > 0 && Date.now() - homeSeenAt <= HOME_SEEN_MAX_AGE_MS;

  if ((!hasRecentHomepageVisit && !referredFromHome) || safeSessionGet(DISMISSED_KEY) === "1") {
    return;
  }

  window.setTimeout(mountGuide, SHOW_DELAY_MS);

  function mountGuide() {
    if (document.querySelector("[data-aes-inquiry-guide]")) {
      return;
    }

    const state = loadState();
    const host = document.createElement("aside");
    host.className = "aes-guide";
    host.dataset.aesInquiryGuide = "";
    host.innerHTML = `
      <section class="aes-guide__panel" role="dialog" aria-modal="false" aria-labelledby="aes-guide-title" hidden>
        <header class="aes-guide__header">
          <span class="aes-guide__header-mark" aria-hidden="true">AI</span>
          <div class="aes-guide__heading">
            <strong id="aes-guide-title">Project guide</strong>
            <span>Build a clear inquiry, one question at a time</span>
          </div>
          <button class="aes-guide__close" type="button" aria-label="Close project guide">×</button>
        </header>
        <div class="aes-guide__body">
          <div class="aes-guide__messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
          <div class="aes-guide__quick-replies" aria-label="Suggested starting points">
            <button type="button" data-guide-reply="I’m exploring private AI or software automation.">Private AI</button>
            <button type="button" data-guide-reply="I have a robotics or embedded systems project.">Robotics</button>
            <button type="button" data-guide-reply="I know the problem, but I’m not sure what kind of solution fits.">Not sure yet</button>
          </div>
          <p class="aes-guide__typing" hidden>Project guide is thinking…</p>
          <section class="aes-guide__review" aria-labelledby="aes-guide-review-title" hidden>
            <h3 id="aes-guide-review-title">Review your inquiry</h3>
            <dl class="aes-guide__summary"></dl>
            <div class="aes-guide__contact-fields">
              <label class="aes-guide__field">Your name <input name="guideName" autocomplete="name" maxlength="100" /></label>
              <label class="aes-guide__field">Organization <input name="guideOrganization" autocomplete="organization" maxlength="120" /></label>
              <label class="aes-guide__field aes-guide__field--wide">Best contact email <input name="guideEmail" type="email" autocomplete="email" maxlength="160" /></label>
            </div>
            <div class="aes-guide__review-actions">
              <a class="aes-guide__email-action" href="#">Open prepared email</a>
              <div class="aes-guide__review-button-row">
                <button class="aes-guide__secondary-action" type="button" data-guide-copy>Copy summary</button>
                <button class="aes-guide__secondary-action" type="button" data-guide-restart>Start over</button>
              </div>
            </div>
            <p class="aes-guide__notice">These contact fields stay in your browser and are added only to the email you review.</p>
          </section>
        </div>
        <form class="aes-guide__composer">
          <label for="aes-guide-input">Tell the project guide about your need</label>
          <div class="aes-guide__composer-row">
            <textarea id="aes-guide-input" name="message" rows="1" maxlength="900" placeholder="Describe the problem or goal…" required></textarea>
            <button class="aes-guide__send" type="submit">Send</button>
          </div>
          <button class="aes-guide__finish" type="button" hidden>Prepare my inquiry</button>
          <p class="aes-guide__notice">Uses Google Gemini. Do not share confidential data, passwords, keys, private records, or source code.</p>
          <p class="aes-guide__status" role="status" hidden></p>
        </form>
      </section>
      <div class="aes-guide__launcher-row">
        <button class="aes-guide__launcher" type="button" aria-expanded="false" aria-controls="aes-guide-panel">
          <span class="aes-guide__launcher-mark" aria-hidden="true">AI</span>
          <span>Need help shaping your project?</span>
        </button>
        <button class="aes-guide__dismiss" type="button" aria-label="Dismiss project guide for this visit">×</button>
      </div>
    `;

    const panel = host.querySelector(".aes-guide__panel");
    panel.id = "aes-guide-panel";
    const launcher = host.querySelector(".aes-guide__launcher");
    const dismissButton = host.querySelector(".aes-guide__dismiss");
    const closeButton = host.querySelector(".aes-guide__close");
    const messagesElement = host.querySelector(".aes-guide__messages");
    const quickReplies = host.querySelector(".aes-guide__quick-replies");
    const typingElement = host.querySelector(".aes-guide__typing");
    const reviewElement = host.querySelector(".aes-guide__review");
    const summaryElement = host.querySelector(".aes-guide__summary");
    const form = host.querySelector(".aes-guide__composer");
    const input = form.elements.message;
    const sendButton = host.querySelector(".aes-guide__send");
    const finishButton = host.querySelector(".aes-guide__finish");
    const statusElement = host.querySelector(".aes-guide__status");
    const emailAction = host.querySelector(".aes-guide__email-action");
    const nameInput = formOwnerInput(host, "guideName");
    const organizationInput = formOwnerInput(host, "guideOrganization");
    const emailInput = formOwnerInput(host, "guideEmail");
    let busy = false;

    if (!state.messages.length) {
      state.messages.push({ role: "model", text: GREETING });
    }

    document.body.append(host);
    renderAll();

    launcher.addEventListener("click", () => setOpen(panel.hidden));
    closeButton.addEventListener("click", () => setOpen(false));
    dismissButton.addEventListener("click", dismissGuide);
    host.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
      }
    });

    quickReplies.addEventListener("click", (event) => {
      const button = event.target.closest("[data-guide-reply]");
      if (button) {
        sendMessage(button.dataset.guideReply);
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    finishButton.addEventListener("click", () => {
      sendMessage("Please prepare the inquiry summary now using what I shared. Leave anything optional that I do not know blank.");
    });

    [nameInput, organizationInput, emailInput].forEach((field) => {
      field.addEventListener("input", updateEmailAction);
    });

    host.querySelector("[data-guide-copy]").addEventListener("click", copySummary);
    host.querySelector("[data-guide-restart]").addEventListener("click", restartGuide);

    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute("aria-expanded", String(open));
      launcher.querySelector("span:last-child").textContent = open ? "Project guide is open" : "Need help shaping your project?";

      if (open) {
        window.setTimeout(() => input.focus(), 0);
        scrollMessagesToEnd();
      } else {
        launcher.focus();
      }
    }

    function dismissGuide() {
      safeSessionSet(DISMISSED_KEY, "1");
      host.remove();
    }

    async function sendMessage(rawText) {
      const text = String(rawText || "").trim();

      if (!text || busy) {
        return;
      }

      if (state.callCount >= MAX_CLIENT_CALLS) {
        showStatus("This short guide has reached its conversation limit. Prepare an email with the notes already here.", true);
        showReviewWithBestDraft();
        return;
      }

      clearStatus();
      state.messages.push({ role: "user", text: text.slice(0, 900) });
      state.messages = state.messages.slice(-MAX_STORED_MESSAGES);
      input.value = "";
      state.callCount += 1;
      saveState(state);
      setBusy(true);
      renderMessages();

      try {
        const response = await fetch("/api/inquiry-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Inquiry-Assistant": "1",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            page: currentPath,
            messages: state.messages,
          }),
        });
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (body.code === "sensitive_input") {
            state.messages.pop();
            state.callCount = Math.max(0, state.callCount - 1);
            saveState(state);
            renderMessages();
          }
          throw new Error(body.error || "The project guide could not respond.");
        }

        const reply = cleanText(body.reply, 900);

        if (!reply) {
          throw new Error("The project guide returned an empty response.");
        }

        state.messages.push({ role: "model", text: reply });
        state.messages = state.messages.slice(-MAX_STORED_MESSAGES);
        state.inquiry = normalizeInquiry(body.inquiry);
        state.ready = Boolean(body.ready_to_submit);
        saveState(state);
        renderAll();
      } catch (error) {
        showStatus(error.message || "The project guide could not respond. Your draft is still here.", true);

        if (state.callCount >= 2) {
          showReviewWithBestDraft();
        }
      } finally {
        setBusy(false);
      }
    }

    function setBusy(nextBusy) {
      busy = nextBusy;
      input.disabled = nextBusy;
      sendButton.disabled = nextBusy;
      finishButton.disabled = nextBusy;
      typingElement.hidden = !nextBusy;
      quickReplies.querySelectorAll("button").forEach((button) => {
        button.disabled = nextBusy;
      });
      scrollMessagesToEnd();
    }

    function renderAll() {
      renderMessages();
      const userMessageCount = state.messages.filter((message) => message.role === "user").length;
      quickReplies.hidden = userMessageCount > 0;
      finishButton.hidden = userMessageCount < 2 || state.ready;
      reviewElement.hidden = !state.ready;

      if (state.ready) {
        renderSummary();
      }
    }

    function renderMessages() {
      messagesElement.replaceChildren();

      state.messages.forEach((message) => {
        const item = document.createElement("p");
        item.className = `aes-guide__message aes-guide__message--${message.role === "user" ? "user" : "model"}`;
        item.textContent = message.text;
        messagesElement.append(item);
      });

      scrollMessagesToEnd();
    }

    function renderSummary() {
      const inquiry = normalizeInquiry(state.inquiry);
      const rows = [
        ["Project lane", laneLabel(inquiry.lane)],
        ["Project type", inquiry.project_type],
        ["Challenge", inquiry.challenge],
        ["Current setup", inquiry.current_setup],
        ["Desired outcome", inquiry.desired_outcome],
        ["Timeline", inquiry.timeline],
      ].filter(([, value]) => Boolean(value));
      summaryElement.replaceChildren();

      rows.forEach(([label, value]) => {
        const wrapper = document.createElement("div");
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        wrapper.append(term, description);
        summaryElement.append(wrapper);
      });

      updateEmailAction();
      window.setTimeout(() => reviewElement.scrollIntoView({ block: "nearest" }), 0);
    }

    function showReviewWithBestDraft() {
      if (!state.inquiry?.challenge) {
        const userNotes = state.messages
          .filter((message) => message.role === "user")
          .map((message) => message.text)
          .filter((text) => !text.startsWith("Please prepare the inquiry summary"))
          .join(" ")
          .slice(0, 700);
        state.inquiry = {
          ...normalizeInquiry(state.inquiry),
          challenge: userNotes || "Project details are in the conversation notes.",
        };
      }

      state.ready = true;
      saveState(state);
      renderAll();
    }

    function updateEmailAction() {
      const inquiry = normalizeInquiry(state.inquiry);
      const recipient = inquiry.lane === "robotics" ? ROBOTICS_EMAIL : SOFTWARE_EMAIL;
      const subjectBase = inquiry.lane === "robotics" ? "Robotics project inquiry" : "AI Embedded Systems project inquiry";
      const subject = inquiry.project_type ? `${subjectBase}: ${inquiry.project_type}` : subjectBase;
      const lines = [
        "Hi AI Embedded Systems,",
        "",
        nameInput.value.trim() ? `Name: ${nameInput.value.trim()}` : "",
        organizationInput.value.trim() ? `Organization: ${organizationInput.value.trim()}` : "",
        emailInput.value.trim() ? `Best contact email: ${emailInput.value.trim()}` : "",
        "",
        `Project lane: ${laneLabel(inquiry.lane) || "Not sure yet"}`,
        inquiry.project_type ? `Project type: ${inquiry.project_type}` : "",
        inquiry.challenge ? `Challenge: ${inquiry.challenge}` : "",
        inquiry.current_setup ? `Current setup: ${inquiry.current_setup}` : "",
        inquiry.desired_outcome ? `Desired outcome: ${inquiry.desired_outcome}` : "",
        inquiry.timeline ? `Timeline: ${inquiry.timeline}` : "",
        "",
        "I reviewed this summary before sending it.",
      ].filter((line, index, all) => line !== "" || all[index - 1] !== "");
      emailAction.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    }

    async function copySummary() {
      const inquiry = normalizeInquiry(state.inquiry);
      const summary = [
        `Project lane: ${laneLabel(inquiry.lane) || "Not sure yet"}`,
        inquiry.project_type ? `Project type: ${inquiry.project_type}` : "",
        inquiry.challenge ? `Challenge: ${inquiry.challenge}` : "",
        inquiry.current_setup ? `Current setup: ${inquiry.current_setup}` : "",
        inquiry.desired_outcome ? `Desired outcome: ${inquiry.desired_outcome}` : "",
        inquiry.timeline ? `Timeline: ${inquiry.timeline}` : "",
      ].filter(Boolean).join("\n");

      try {
        await navigator.clipboard.writeText(summary);
        showStatus("Inquiry summary copied.", false);
      } catch {
        showStatus("Copy was blocked by the browser. The prepared email still works.", true);
      }
    }

    function restartGuide() {
      state.messages = [{ role: "model", text: GREETING }];
      state.inquiry = emptyInquiry();
      state.ready = false;
      state.callCount = 0;
      nameInput.value = "";
      organizationInput.value = "";
      emailInput.value = "";
      clearStatus();
      saveState(state);
      renderAll();
      input.focus();
    }

    function showStatus(message, isError) {
      statusElement.textContent = message;
      statusElement.hidden = false;
      statusElement.classList.toggle("aes-guide__status--error", Boolean(isError));
    }

    function clearStatus() {
      statusElement.textContent = "";
      statusElement.hidden = true;
      statusElement.classList.remove("aes-guide__status--error");
    }

    function scrollMessagesToEnd() {
      window.setTimeout(() => {
        const body = host.querySelector(".aes-guide__body");
        body.scrollTop = body.scrollHeight;
      }, 0);
    }
  }

  function formOwnerInput(host, name) {
    return host.querySelector(`[name="${name}"]`);
  }

  function loadState() {
    const fallback = {
      messages: [],
      inquiry: emptyInquiry(),
      ready: false,
      callCount: 0,
    };
    const raw = safeSessionGet(STATE_KEY);

    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw);
      const messages = Array.isArray(parsed.messages)
        ? parsed.messages
            .filter((message) => message?.role === "user" || message?.role === "model")
            .map((message) => ({ role: message.role, text: cleanText(message.text, 900) }))
            .filter((message) => message.text)
            .slice(-MAX_STORED_MESSAGES)
        : [];
      return {
        messages,
        inquiry: normalizeInquiry(parsed.inquiry),
        ready: Boolean(parsed.ready),
        callCount: Math.max(0, Math.min(MAX_CLIENT_CALLS, Number(parsed.callCount) || 0)),
      };
    } catch {
      return fallback;
    }
  }

  function saveState(state) {
    safeSessionSet(STATE_KEY, JSON.stringify({
      messages: state.messages.slice(-MAX_STORED_MESSAGES),
      inquiry: normalizeInquiry(state.inquiry),
      ready: Boolean(state.ready),
      callCount: state.callCount,
    }));
  }

  function normalizeInquiry(value) {
    const inquiry = value && typeof value === "object" ? value : {};
    const lane = ["software_ai", "robotics", "unsure"].includes(inquiry.lane) ? inquiry.lane : "unsure";
    return {
      lane,
      project_type: cleanText(inquiry.project_type, 180),
      challenge: cleanText(inquiry.challenge, 360),
      current_setup: cleanText(inquiry.current_setup, 360),
      desired_outcome: cleanText(inquiry.desired_outcome, 360),
      timeline: cleanText(inquiry.timeline, 180),
    };
  }

  function emptyInquiry() {
    return {
      lane: "unsure",
      project_type: "",
      challenge: "",
      current_setup: "",
      desired_outcome: "",
      timeline: "",
    };
  }

  function laneLabel(lane) {
    if (lane === "software_ai") return "Software and private AI";
    if (lane === "robotics") return "Robotics and embedded systems";
    return "Not sure yet";
  }

  function cleanText(value, maxLength) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
  }

  function normalizePath(value) {
    const path = String(value || "/").split(/[?#]/, 1)[0];
    if (path === "/") return "/";
    const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
  }

  function isSameOriginHomepageReferrer(referrer) {
    if (!referrer) return false;

    try {
      const url = new URL(referrer);
      return url.origin === window.location.origin && normalizePath(url.pathname) === "/";
    } catch {
      return false;
    }
  }

  function safeSessionGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSessionSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // The guide still works for the current page when storage is unavailable.
    }
  }
})();
