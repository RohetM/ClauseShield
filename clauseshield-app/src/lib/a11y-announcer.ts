export function announce(message: string) {
  const container = document.getElementById('a11y-announcer-container');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  container.appendChild(msgDiv);

  setTimeout(() => {
    container.removeChild(msgDiv);
  }, 3000);
}
