const $actions = document.querySelector('.container-actions');
$actions.addEventListener('action-selected', (event) => {
  setActiveAction(event.detail.newAction);
}, true);

function setActiveAction(newAction) {
  const $action = document.querySelector('.container-action.active');
  $action.classList.remove('active');
  const $nextAction = document.querySelector(`.container-action.action-${newAction}`);
  $nextAction.classList.add('active');
}
