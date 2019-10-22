const form = document.getElementById('registrar');
const input = form.querySelector('input');
const mainDiv = document.querySelector('.main');
const ul = document.getElementById('invitedList');

const off = document.getElementById("off-option");
const yes = document.getElementById("yes-option");
const no = document.getElementById("no-option");

const clearBtn = document.getElementById('clear-btn');

let inviteeIndex;

let inviteeArray = [];
let inviteeString= '';


const lis = ul.children;

function highlightOption() {
	this.classList.add("highlighted");
  switch (this.innerHTML) {
  	case "'yes'":
        off.classList.remove("highlighted");
        no.classList.remove("highlighted");
        filterInvitees('yes');
        break;
    case "'no'":
    	off.classList.remove("highlighted");
        yes.classList.remove("highlighted");
        filterInvitees('no');
        break;
    case "off":
    	yes.classList.remove("highlighted");
        no.classList.remove("highlighted");
        for (let i = 0; i < lis.length; i++) {
            lis[i].style.display = '';
        }
        break;
  }
}

off.addEventListener("click", highlightOption);
yes.addEventListener("click", highlightOption);
no.addEventListener("click", highlightOption);

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

ul.addEventListener('change', (e) => {
    const checkbox = e.target;
    if (checkbox.previousSibling.textContent === "Can't make it" || checkbox.previousSibling.textContent === "I'll be there") {
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
    }
});

ul.addEventListener('click', (e) => {
    const button = e.target;
    if (button.tagName === 'BUTTON') {
        const li = button.parentNode;
        const name = li.firstChild.textContent;
        let oldName;
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
        let currentObj;
        const ul = li.parentNode;
        const action = button.textContent;
        checkForChecked();
        const nameActions = {
            remove: () => {
                currentObj = inviteeArray.find(function(obj) {return obj.name === name;});
                inviteeIndex = inviteeArray.indexOf(currentObj);
                inviteeArray.splice(inviteeIndex, 1);
                ul.removeChild(li);
                localStorage.setItem('recentInvitees', JSON.stringify(inviteeArray));

            },
            edit: () => {
                const span = li.firstElementChild;
                oldName = span.textContent;
                currentObj = inviteeArray.find(function(obj) {return obj.name === oldName;});
                inviteeIndex = inviteeArray.indexOf(currentObj);
                const input = document.createElement('input');
                input.type = 'text';
                input.value = span.textContent;
                li.insertBefore(input, span);
                li.removeChild(span);
                button.textContent = 'save';
            },
            save: () => {
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