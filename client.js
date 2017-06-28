/* eslint-disable */

$(function () {
  $ownerSelect = $('#owner-select');
  $petList = $('#pet-list');
  $petForm = $('#pet-form');

  $.get('/owners')
    .then(owners => {
      owners.forEach(owner => {
        $ownerOption = $(`<option value="${owner.id}">${owner.name}</option>`);
        $ownerSelect.append($ownerOption);
      })
      .catch(console.error.bind(console));
    });
  
  $ownerSelect.on('change', () => {
    $.get(`/owners/${$ownerSelect.val()}/pets`)
      .then(pets => {
        $petList.html('');
        pets.forEach(addPetToList);
      })
      .catch(console.error.bind(console));
  });

  $petForm.on('submit', (evt) => {
    evt.preventDefault();
    $petInput = $('#pet-input');
    const name = $petInput.val();
    $petInput.val('');
    $.post(`/owners/${$ownerSelect.val()}/pets`, { name })
      .then(addPetToList)
      .catch(console.error.bind(console));
  });

  function addPetToList (pet) {
    $petLi = $(`<li>${pet.name}</li>`);
    $petList.append($petLi);
  }
});
