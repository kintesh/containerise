const $actions = document.querySelector('body');
$actions.addEventListener('action-selected', (event) => {
  setActiveAction(event.detail.newAction);
}, true);

function setActiveAction(newAction) {
  const $action = document.querySelector('.container-action.active');
  $action && $action.classList.remove('active');
  if(newAction){
    const $nextAction = document.querySelector(`.container-action.action-${newAction}`);
    $nextAction.classList.add('active');
  }
}
