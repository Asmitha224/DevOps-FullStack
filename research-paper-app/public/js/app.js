// =====================================================
//  ResearchHub — Global App JS
// =====================================================

// Sidebar toggle (mobile)
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !sidebarToggle.contains(e.target)
    ) {
      sidebar.classList.remove('open');
    }
  });
}

// Delete confirmation
function confirmDelete(itemName) {
  return confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`);
}

// Auto-dismiss alerts after 5 seconds
document.querySelectorAll('.alert').forEach((alert) => {
  setTimeout(() => {
    alert.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-8px)';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
});

// Character counter for textareas with maxlength
document.querySelectorAll('textarea[maxlength]').forEach((ta) => {
  const max = parseInt(ta.getAttribute('maxlength'));
  const hint = ta.closest('.form-group')?.querySelector('.form-hint');
  if (!hint) return;
  const updateCounter = () => {
    const remaining = max - ta.value.length;
    hint.textContent = `${ta.value.length.toLocaleString()} / ${max.toLocaleString()} characters`;
    hint.style.color = remaining < 200 ? '#f78166' : '';
  };
  ta.addEventListener('input', updateCounter);
  updateCounter();
});
