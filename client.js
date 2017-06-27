/* eslint-disable */

$(function () {
  const $ownerSelect = $('#owner-select');
  const $petList = $('#pet-list');

  $ownerSelect.on('change', (evt) => {
    $.get(`/owners/${$ownerSelect.val()}/pets`)
      .then(pets => {
        $petList.html(''); // clear out list first!
        pets.forEach(addPetToList); // list them pets
      });
  });

  $.get('/owners')
    .then(owners => {
      owners.forEach(addOwnerToSelect);
    });

  $('#pet-form').submit(function (evt) {
    evt.preventDefault(); // prevent refresh
    const $petInput = $('#pet-input');
    $.post(`/owners/${$ownerSelect.val()}/pets`, {
        name: $petInput.val(),
      })
      .then(response => console.log('response', response));

    addPetToList({ name: $petInput.val() });
    $petInput.val(''); // reset input to blank
  });

  function addPetToList (pet) {
    $petItem = $(`<li>${pet.name}</li>`);
    $petList.append($petItem);
  }

  function addOwnerToSelect (owner) {
    $ownerOption = $(`<option value="${owner.id}">${owner.name}</option>`);
    $ownerSelect.append($ownerOption);
  }
});
