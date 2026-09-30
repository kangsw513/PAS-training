function toggleCategory(button) {
  const category = button.closest('.category');
  const tools = category.querySelector('.tools');

  if (tools.style.display === 'none') {
    tools.style.display = '';
    button.textContent = '닫기';
  } else {
    tools.style.display = 'none';
    button.textContent = '열기';
  }
}
