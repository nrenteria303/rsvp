const form = document.getElementById('registrar');
const input = form.querySelector('input');
const mainDiv = document.querySelector('.main');
const ul = document.getElementById('invitedList');

const filterYesLabel = document.getElementById('filter-yes-label');
const filterYesCheckBox = document.getElementById('filter-yes-checkbox');
const filterNoLabel = document.getElementById('filter-no-label');
const filterNoCheckBox = document.getElementById('filter-no-checkbox');

const clearBtn = document.getElementById('clear-btn');

let inviteeIndex;

let inviteeArray = [];
let inviteeString= '';


const lis = ul.children;

function filterInvitees(response) {
    for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        if (li.className === 'responded-' + response) {
            li.style.display = '';
        } else {
            li.style.display= 'none';
        }
    }
}

function checkInviteeName() {

}

function supportsLocalStorage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch(e) {
        return false;
    }
}

function getRecentInvitees() {
    var invitees = localStorage.getItem('recentInvitees');
    if (invitees && inviteeString !== '' && invitees !== inviteeString) {
        return JSON.parse(inviteeString);
    } else if (invitees) {
        let newInviteeArray = JSON.parse(invitees);
        return newInviteeArray.filter(function(obj) {return obj !== '';});
    } else {
        return [];
    }
}

function saveInviteeString(str) {
    if (inviteeArray.filter(function(obj) {return obj.name === str;}).length !== 0 && inviteeArray.length !== 0) {
        alert('This name is already in your invitee list.');
        return false;
    } else if (!str) {
        return false;
    } else {
        inviteeArray.push({name: str, isChecked: false, yes: false, no: false});
        localStorage.setItem('recentInvitees', JSON.stringify(inviteeArray));
        return true;
    }
}

filterYesCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
        filterInvitees('yes');
        filterNoCheckBox.style.display = 'none';
        filterNoLabel.style.display = 'none';
    } else {
        for (let i = 0; i < lis.length; i++) {
            let li = lis[i];
            li.style.display = '';
        }
        filterNoCheckBox.style.display = '';
        filterNoLabel.style.display = '';
    }
});

filterNoCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
        filterInvitees('no');
        filterYesCheckBox.style.display = 'none';
        filterYesLabel.style.display = 'none';
    } else {
        for (let i = 0; i < lis.length; i++) {
            let li = lis[i];
            li.style.display = '';
        }
        filterYesCheckBox.style.display = '';
        filterYesLabel.style.display = '';
    }
});

function createLi(text) {
    function createElement(elementName, property, value) {
        const element = document.createElement(elementName);
        element[property] = value;
        return element;
    }
    function appendToLI(elementName, property, value) {
        const element = createElement(elementName, property, value);
        li.appendChild(element);
        return element;
    }
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);
    appendToLI('label', 'textContent', 'I\'ll be there').appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('label', 'textContent', 'Can\'t make it').appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
}

window.onload = function() {
    if (supportsLocalStorage) {

        // Initialize display list
        var recentInvitees = getRecentInvitees();
        recentInvitees.forEach(function(inviteeStr) {
            inviteeArray.push(inviteeStr);
            const li = createLi(inviteeStr.name);
            const checkYes = li.children[1].childNodes[1];
            const checkNo = li.children[2].childNodes[1];
            ul.appendChild(li);
            if (inviteeStr.isChecked === true) {
                if (inviteeStr.yes === true) {
                    checkYes.click();
                } else if (inviteeStr.no === true) {
                    checkNo.click();
                }
            }
        });
        localStorage.setItem('recentInvitees', JSON.stringify(inviteeArray));

        // Set event handlers
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value == '' || input.value == ' ') {
                alert('Please enter an invitee name');
            } else {
                const text = input.value;
                input.value = '';

                if (saveInviteeString(text)) {
                    const li = createLi(text);
                    ul.appendChild(li);
                }
            }
});
    }
}

// // Set event handlers
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if (input.value == '' || input.value == ' ') {
//         alert('Please enter an invitee name');
//     } else {
//         const text = input.value;
//         input.value = '';

//         if (saveInviteeString(text)) {
//             const li = createLi(text);
//             ul.appendChild(li);
//         }
//     }
// });

ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    const checkboxLabel = checkbox.parentNode;
    const li = checkboxLabel.parentNode;
    const name = li.firstChild.textContent;
    const checked = checkbox.checked;
    listItem = checkbox.parentNode.parentNode;
    inviteeIndex = inviteeArray.indexOf(inviteeArray.find(function(obj) {return obj.name === name;}));

    if (checked && checkboxLabel.textContent === "I'll be there") {
        listItem.className = 'responded-yes';
        checkboxLabel.nextElementSibling.style.display = 'none';
        inviteeArray[inviteeIndex].isChecked = true;
        inviteeArray[inviteeIndex].yes = true;
    } else if (checked && checkboxLabel.textContent === "Can't make it") {
        listItem.className = 'responded-no';
        checkboxLabel.previousElementSibling.style.display = 'none';
        inviteeArray[inviteeIndex].isChecked = true;
        inviteeArray[inviteeIndex].no = true;
    } else {
        listItem.className = '';
        checkboxLabel.nextElementSibling.style.display = '';
        checkboxLabel.previousElementSibling.style.display = '';
        inviteeArray[inviteeIndex].isChecked = false;
        inviteeArray[inviteeIndex].yes = false;
        inviteeArray[inviteeIndex].no = false;
    }
    localStorage.setItem('recentInvitees', JSON.stringify(inviteeArray));
});

ul.addEventListener('click', (e) => {
    const button = e.target;
    if (button.tagName === 'BUTTON') {
        const li = button.parentNode;
        const checkYes = li.children[1].childNodes[1];
        const checkNo = li.children[2].childNodes[1];
        let isLiChecked;
        function checkForChecked() {
            if (checkYes.checked || checkNo.checked) {
                isLiChecked = true;
            } else {
                isLiChecked = false;
            }
        }
        const name = li.firstChild.textContent;
        const currentObj = inviteeArray.find(function(obj) {return obj === name;});
        const ul = li.parentNode;
        const action = button.textContent;
        const nameActions = {
            remove: () => {
                ul.removeChild(li);
                inviteeArray.splice(inviteeArray.indexOf(currentObj), 1);
                if (inviteeArray.length > 2) {
                    inviteeString = '["' + inviteeArray[0] + '",'
                    for (let i = 1; i < (inviteeArray.length - 1); i++) {
                        inviteeString += '"' + inviteeArray[i] + '",';
                    }
                    inviteeString += '"' + inviteeArray[inviteeArray.length - 1] + '"]';
                } else if (inviteeArray.length > 1) {
                    inviteeString = '["' + inviteeArray[0] + '", "' + inviteeArray[1] + '"]';
                } else {
                    inviteeString = '["' + inviteeArray[0] + '"]';
                }
                localStorage.setItem('recentInvitees', inviteeString);

            },
            edit: () => {
                inviteeIndex = inviteeArray.indexOf(currentObj);
                const span = li.firstElementChild;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                li.insertBefore(input, span);
                li.removeChild(span);
                button.textContent = 'save';
            },
            save: () => {
                checkForChecked();
                // inviteeIndex = inviteeArray.indexOf(currentObj);
                const input = li.firstElementChild;
                const newSpan = document.createElement('span');
                inviteeArray.splice(inviteeIndex, 1, {name: input.value, isChecked: isLiChecked, yes: checkYes.checked, no: checkNo.checked}); 
                newSpan.textContent = input.value;
                li.insertBefore(newSpan, input);
                li.removeChild(input);
                localStorage.setItem('recentInvitees', JSON.stringify(inviteeArray));             
                button.textContent = 'edit';
            }
        }
        nameActions[action](); // select and run action in button's name
    }
});

clearBtn.addEventListener('click', (e) => {
    let clearConfirm = confirm('Do you really want to erase this list of event invitees?');
    if (clearConfirm) {
        localStorage.clear();
        location.reload();
    }
});
