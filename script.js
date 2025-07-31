const storageInput = document.querySelector('.storage');  
const savings = document.querySelector('.savings');
const button = document.querySelector('.button');

storageInput.addEventListener('input', number => {
	savings.textContent = number.target.value
})

const saveToLocalStorage = () => {
	localStorage.setItem('textinput', text.)
}