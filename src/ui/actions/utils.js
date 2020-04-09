export function makeActionSelectedTrigger($el, newAction) {
  $el.addEventListener('click', function () {
    $el.dispatchEvent(new CustomEvent('action-selected', {
      detail: {newAction},
    }));
  });
}
