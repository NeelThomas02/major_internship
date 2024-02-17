const staticBackdropModal = document.getElementById('staticBackdrop');
const myInput = document.getElementById('myInput')

staticBackdropModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})

