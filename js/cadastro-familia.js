const familyForm = document.querySelector('[data-family-registration]');
const choiceStep = document.querySelector('#care-choice');
const registrationStep = document.querySelector('#registration-step');
const recipientFields = document.querySelector('#recipient-fields');
let careFor = 'self';

document.querySelectorAll('[data-care-for]').forEach(button => button.addEventListener('click', () => {
    careFor = button.dataset.careFor;
    recipientFields.hidden = careFor !== 'other';
    familyForm.elements.recipient.required = careFor === 'other';
    choiceStep.hidden = true;
    registrationStep.hidden = false;
    registrationStep.querySelector('h2').focus({ preventScroll: true });
}));
document.querySelector('#back-to-choice').addEventListener('click', () => {
    registrationStep.hidden = true;
    choiceStep.hidden = false;
});
const initialLocation = new URLSearchParams(location.search).get('location');
if (initialLocation) familyForm.elements.location.value = initialLocation;
familyForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!familyForm.reportValidity()) return;
    const data = new FormData(familyForm);
    sessionStorage.setItem('amparo-family-demo', JSON.stringify({ careFor, name: data.get('name'), recipient: careFor === 'other' ? data.get('recipient') : data.get('name'), relationship: careFor === 'other' ? data.get('relationship') : '', location: data.get('location'), service: data.get('service') }));
    location.href = 'familia.html#search';
});
