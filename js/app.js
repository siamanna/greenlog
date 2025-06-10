// app.js

// Helpers
const storage = {
  get: (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def)),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

// Apply saved settings (themes and stuff)
function applySettings() {
  const s = storage.get('settings', {});
  if (s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-theme');
  }
}

// LOG ACTION PAGE
function initLogForm() {
  const form = document.querySelector('.log-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const date = form['action-date'].value;
    const type = form['action-type'].value;
    const notes = form['notes'].value.trim();
    const actions = storage.get('actions', []);
    actions.push({ date, type, notes });
    storage.set('actions', actions);
    alert('Action saved!');
    form.reset();
  });
}

// GOALS PAGE
function initGoalsForm() {
  const form = document.querySelector('.goals-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = form['goal-title'].value.trim();
    const category = form['goal-category'].value;
    const target = form['target-value'].value;
    const due = form['due-date'].value;
    const notes = form['notes'].value.trim();
    if (!title || !target || !due) {
      alert('Please fill in title, target and due date.');
      return;
    }
    const goals = storage.get('goals', []);
    goals.push({ title, category, target, due, notes });
    storage.set('goals', goals);
    alert('Goal saved!');
    form.reset();
  });
}

// SETTINGS PAGE
function initSettingsForm() {
  const form = document.querySelector('.settings-form');
  if (!form) return;
  // populate form from saved
  const s = storage.get('settings', {});
  if (s.theme) form.theme.value = s.theme;
  if (s.emailNotifications) form['email-notifications'].checked = true;
  if (s.reminderFrequency) form['reminder-frequency'].value = s.reminderFrequency;
  if (s.privacy) form[s.privacy === 'public' ? 'privacy-public' : 'privacy-private'].checked = true;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const theme = form.theme.value;
    const emailNotifications = form['email-notifications'].checked;
    const reminderFrequency = form['reminder-frequency'].value;
    const privacy = form['privacy-public'].checked ? 'public' : 'private';
    storage.set('settings', { theme, emailNotifications, reminderFrequency, privacy });
    applySettings();
    alert('Settings saved!');
  });
}

// STATS PAGE
function initStats() {
  const container = document.querySelector('main');
  if (!container || !document.querySelector('#active a[href="stats.html"]')) return;

  const actions = storage.get('actions', []);
  const summary = document.createElement('div');
  summary.className = 'stats-summary';

  // total count
  const total = actions.length;
  summary.innerHTML = `<h3>Total Actions Logged: ${total}</h3>`;

  // breakdown by category
  const counts = actions.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});
  const list = document.createElement('ul');
  for (const [cat, cnt] of Object.entries(counts)) {
    const li = document.createElement('li');
    li.textContent = `${cat}: ${cnt}`;
    list.appendChild(li);
  }
  summary.appendChild(list);

  // replace placeholder image
  const img = document.querySelector('img.stats-chart');
  if (img) img.replaceWith(summary);
  else container.appendChild(summary);
}

document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  initLogForm();
  initGoalsForm();
  initSettingsForm();
  initStats();
});

