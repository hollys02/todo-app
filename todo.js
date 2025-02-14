let listTabs = null;
let currentTab = null;
let currentList = null;

let globalTabId = 0;

function initTodo()
{
    setupCloseCredits();
    listTabs = document.getElementById("listTabs");

    const savedLists = loadLocalStorage();
    console.log("eepy");
    console.log(savedLists);
    if(savedLists != [] && savedLists.length > 0)
    {
        let filteredLists = [];
        for(let i = 0; i < savedLists.length; i++)
        {
            const list = savedLists[i];
            if(!list.name)
                continue;

            if(list.name == "" && list.items.length == 0)
                continue;

            filteredLists.push(savedLists[i]);
            addList(savedLists[i]);
        }
        saveLocalStorage(filteredLists);
        //saveLocalStorage([]);
    }
    else
    {
        console.log("blah");
        const list = createFreshList();
        const listDiv = document.getElementById("listDiv");
        listDiv.appendChild(list);
    }
}

function bodyClose()
{
    saveLists();
}

function loadLocalStorage()
{
    const storedList = localStorage.getItem("todoList");
    if(storedList)
    {
        console.log("loaded: ");
        console.log(storedList);
        return JSON.parse(storedList);
    }

    return [];
}

function saveLocalStorage(lists)
{
    console.log("saving: ");
    console.log(lists);
    localStorage.setItem("todoList", JSON.stringify(lists));
}

function addList(listJson)
{
    console.log("creating:");
    console.log(listJson);
    const listDiv = document.getElementById("listDiv");
    const list = createList(listJson.name, listJson.items);
    listDiv.appendChild(list);
}

function saveLists()
{
    let lists = [];

    // Get listDiv children
    const listDiv = document.getElementById("listDiv");
    const listDivChildren = listDiv.children;

    // Loop through listDiv children
    for(let i = 0; i < listDivChildren.length; i++)
    {
        const list = listDivChildren[i];
        let listName = list.getElementsByClassName("listTitleInput")[0].value;
        listName ? listName : "";
        const items = list.getElementsByClassName("listItem");

        let itemList = [];
        for(let j = 0; j < items.length; j++)
        {
            const item = items[j];
            const itemName = item.getElementsByClassName("listItemInput")[0].value;
            itemName ? itemName : "";
            
            const itemCheckbox = item.getElementsByClassName("itemCheckbox")[0].checked;

            itemList.push({
                "name": itemName,
                "done": itemCheckbox
            });
        }

        lists.push({
            "name": listName,
            "items": itemList
        });
    }

    saveLocalStorage(lists);
}

function selectTab(tabId)
{
    if(currentTab)
    {
        currentTab.classList.remove("is-active");
    }
    const tab = document.getElementById(tabId);
    currentTab = tab;
    currentTab.classList.add("is-active");

    const listDiv = document.getElementById("listDiv");
    const listDivChildren = listDiv.children;

    for(let i = 0; i < listDivChildren.length; i++)
    {
        const lista = listDivChildren[i];
        lista.classList.add("invisible");
    }

    const idnum = tabId.replace("tab-", "");
    const list = document.getElementById("list-"+idnum);
    if(!list)
    {
        console.log("list id not found: list-"+idnum);
        return;
    }
    list.classList.remove("invisible");
}

function createList(title, items)
{
    const idnum = globalTabId;
    globalTabId++;

    const tab = document.createElement("li");
    tab.id = "tab-"+idnum;
    tab.className = "is-active tab";
    tab.innerHTML = "<a>"+title+"</a>";
    tab.onclick = function() { selectTab(tab.id); };
    listTabs.insertBefore(tab, listTabs.lastElementChild);

    const list = document.createElement("div");
    list.id = "list-"+idnum;
    list.className = "list is-flex is-flex-direction-column";

    const listTitle = createListTitle(title, false);
    list.appendChild(listTitle);

    const listItems = document.createElement("div");
    listItems.className = "listItems is-flex is-flex-direction-column";
    list.appendChild(listItems);

    if(items.length == 0)
    {
        const listItem = createListItem(false, "Item Name", true);
        listItems.appendChild(listItem);
    }
    else
    {
        for(let i = 0; i < items.length; i++)
        {
            const item = items[i];
            const listItem = createListItem(item.done, item.name, false);
            listItems.appendChild(listItem);
        }
    }

    const footer = createListFooter();
    list.appendChild(footer);

    setTimeout(function() { selectTab(tab.id); }, 100);
    return list;
}

function createFreshList()
{
    const list = createList("List Name", []);

    return list;
}

function createListTitle(initialTitle, setAsPlaceholder)
{
    const titleDiv = document.createElement("div");
    titleDiv.className = "listTitle is-flex is-flex-direction-row is-justify-content-center mx-3";

    const listTitle = document.createElement("input");
    listTitle.type = "text";
    listTitle.className = "listTitleInput input is-large is-primary";
    listTitle.onchange = function() { updateListTitle(listTitle); };
    if(setAsPlaceholder)
    {
        listTitle.placeholder = initialTitle;
    }
    else
    {
        listTitle.value = initialTitle;
    }
    titleDiv.appendChild(listTitle);
    return titleDiv;
}

function createListItem(checked, initialText, setAsPlaceholder)
{
    const item = document.createElement("div");
    item.className = "listItem is-flex is-flex-direction-row is-justify-content-center is-align-items-center my-2";

    //const checkbox = createListItemCheckbox(checked);
    const checkbox = createCoolCheckBox(checked);
    item.appendChild(checkbox);

    const text = createListItemText(initialText, setAsPlaceholder, checked);
    item.appendChild(text);

    const deleteButton = createListItemDeleteButton();
    item.appendChild(deleteButton);

    return item;
}

function createCoolCheckBox(checked)
{
    // Create the label element
    const label = document.createElement('label');
    label.className = 'neon-checkbox';

    // Create the checkbox input
    const checkbox = document.createElement('input');
    checkbox.className = 'itemCheckbox';
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.onchange = function() { checkChanged(this); };

    // Create the frame div
    const frame = document.createElement('div');
    frame.className = 'neon-checkbox__frame';

    // Create the box div
    const box = document.createElement('div');
    box.className = 'neon-checkbox__box';

    // Create the check container div
    const checkContainer = document.createElement('div');
    checkContainer.className = 'neon-checkbox__check-container';

    // Create the SVG checkmark
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //const svg = document.createElement("svg");
    //svg.viewBox = '0 0 24 24';
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.classList.add('neon-checkbox__check');
    //svg.className = 'neon-checkbox__check';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    //const path = document.createElement("path");
    path.setAttribute('d', 'M3,12.5l7,7L21,5');

    svg.appendChild(path);
    checkContainer.appendChild(svg);

    // Create the glow div
    const glow = document.createElement('div');
    glow.className = 'neon-checkbox__glow';

    // Create the borders div
    const borders = document.createElement('div');
    borders.className = 'neon-checkbox__borders';

    // Add border spans
    for (let i = 0; i < 4; i++) {
        const borderSpan = document.createElement('span');
        borders.appendChild(borderSpan);
    }

    // Append elements to the box
    box.appendChild(checkContainer);
    box.appendChild(glow);
    box.appendChild(borders);

    // Create the effects div
    const effects = document.createElement('div');
    effects.className = 'neon-checkbox__effects';

    // Create the particles div
    const particles = document.createElement('div');
    particles.className = 'neon-checkbox__particles';

    // Add particle spans
    for (let i = 0; i < 12; i++) {
        const particleSpan = document.createElement('span');
        particles.appendChild(particleSpan);
    }

    // Create the rings div
    const rings = document.createElement('div');
    rings.className = 'neon-checkbox__rings';

    // Add ring divs
    for (let i = 0; i < 3; i++) {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'ring';
        rings.appendChild(ringDiv);
    }

    // Create the sparks div
    const sparks = document.createElement('div');
    sparks.className = 'neon-checkbox__sparks';

    // Add spark spans
    for (let i = 0; i < 4; i++) {
        const sparkSpan = document.createElement('span');
        sparks.appendChild(sparkSpan);
    }

    // Append elements to the effects div
    effects.appendChild(particles);
    effects.appendChild(rings);
    effects.appendChild(sparks);

    // Append elements to the frame
    frame.appendChild(box);
    frame.appendChild(effects);

    // Append elements to the label
    label.appendChild(checkbox);
    label.appendChild(frame);

    return label;
}

function createListItemText(initialText, setAsPlaceholder, checked)
{
    const itemName = document.createElement("input");
    itemName.onchange = function() { updateListItemText(itemName); };
    itemName.type = "text";
    itemName.className = "listItemInput input mx-3";
    if(checked)
        itemName.classList.add("is-success");
    if(setAsPlaceholder)
    {
        itemName.placeholder = initialText;
    }
    else
    {
        itemName.value = initialText;
    }
    return itemName;
}

function createListItemDeleteButton()
{
    const deleteButton = document.createElement("button");
    deleteButton.className = "button btnItemDelete";
    deleteButton.onclick = function() { btnDeleteItem(deleteButton); };
    const span = document.createElement("span");
    span.className = "material-symbols-outlined";
    span.innerHTML = "delete";
    deleteButton.appendChild(span);
    return deleteButton;
}

function createListFooter()
{
    const footer = document.createElement("div");
    footer.className = "listFooter is-flex is-flex-direction-row is-justify-content-center";

    const newItemButton = createItemButton();
    footer.appendChild(newItemButton);

    const deleteListButton = createDeleteListButton();
    footer.appendChild(deleteListButton);

    return footer;
}

function createItemButton()
{
    const itemButton = document.createElement("button");
    itemButton.className = "button is-success is-dark mr-3 btnNewItem";
    itemButton.innerHTML = "New Item";
    itemButton.onclick = function() { btnCreateItem(itemButton); };
    return itemButton;
}

function createDeleteListButton()
{
    const button = document.createElement("button");
    button.className = "button is-danger is-dark ml-3 btnListDelete";
    button.innerHTML = "Delete List";
    button.onclick = function() { btnDeleteList(button); };
    button.onmouseleave = function() { btnDeleteLeave(button); };
    return button;
}

function updateListTitle(listTitleInput)
{
    const list = listTitleInput.parentElement.parentElement;
    const tabId = list.id.replace("list-", "tab-");
    const tab = document.getElementById(tabId);
    tab.innerHTML = "<a>"+listTitleInput.value+"</a>";
    saveLists();
}

function updateListItemText(listItemInput)
{
    saveLists();
}

function btnDeleteItem(caller)
{
    const item = caller.parentElement;
    item.remove();
    saveLists();
}

function btnCreateItem(caller)
{
    const footer = caller.parentElement;
    const list = footer.parentElement;
    const itemlist = list.getElementsByClassName("listItems")[0];
    const listItem = createListItem(false, "Item Name", true);
    itemlist.appendChild(listItem);
}

function checkChanged(caller)
{
    const checkLabel = caller.parentElement;
    const listItem = checkLabel.parentElement;
    const listItemText = listItem.getElementsByClassName("listItemInput")[0];
    if(caller.checked)
    {
        listItemText.classList.add("is-success");
        playCheckedSound();
    }
    else
    {
        listItemText.classList.remove("is-success");
        playUncheckedSound();
    }
    saveLists();
}

function playCheckedSound()
{
    const sound = new Audio("assets/checked.mp3");
    sound.volume = 0.6;
    sound.play();
}

function playUncheckedSound()
{
    // choose random sound
    let soundnum = Math.floor(Math.random() * 3);
    if(soundnum == 0)
    {
        const sound = new Audio("assets/unchecked1.mp3");
        sound.volume = 0.25;
        sound.play();
    }
    else if(soundnum == 1)
    {
        const sound = new Audio("assets/unchecked2.mp3");
        sound.volume = 0.25;
        sound.play();
    }
    else if(soundnum == 2)
    {
        const sound = new Audio("assets/unchecked3.mp3");
        sound.volume = 0.25;
        sound.play();
    }
}

function btnDeleteList(caller)
{
    // if button has is-dark class, change text to "Are you sure?" and remove is-dark class
    // if button doesn't have is-dark class, remove list

    // check classlist
    if(!caller.classList.contains("is-dark"))
    {
        // remove list
        const listfooter = caller.parentElement;
        const list = listfooter.parentElement;
        const tabId = list.id.replace("list-", "tab-");
        const tab = document.getElementById(tabId);

        if(listTabs.children.length > 2)
        {
            let shouldSelectNext = false;
            for(let i = listTabs.children.length-2; i >= 0; i--)
            {
                const tab = listTabs.children[i];
                if(shouldSelectNext)
                {
                    selectTab(tab.id);
                    break;
                }

                if(tab.id == tabId)
                {
                    if(i == 0)
                    {
                        selectTab(listTabs.children[1].id);
                        break;
                    }
                    shouldSelectNext = true;
                }
            }
        }
        else
        {
            const listDiv = document.getElementById("listDiv");
            const newList = createFreshList();
            listDiv.appendChild(newList);
        }

        list.remove();
        tab.remove();

        saveLists();
    }
    else
    {
        // change text to "Are you sure?"
        caller.style.width = "155px";
        setTimeout(function() { if(caller) caller.innerHTML = "Are you sure?"; }, 350);
        
        caller.classList.remove("is-dark");
    }
}

function btnDeleteLeave(caller)
{
    // if button has doesn't have is-dark class, change text to "Delete" and add is-dark class after 3 seconds

    if(!caller.classList.contains("is-dark"))
    {
        setTimeout(resetDeleteListButton, 2500, caller);
    }
}

function resetDeleteListButton(button)
{
    if(!button)
        return;
    button.innerHTML = "Delete List";
    button.classList.add("is-dark");
    button.style.width = "125px";
}

function btnNewList()
{
    const listDiv = document.getElementById("listDiv");
    const list = createFreshList();
    listDiv.appendChild(list);

    saveLists();
}

function btnShowCredits()
{
    const credits = document.getElementById("creditsModal");
    credits.classList.toggle("is-active");
}

function setupCloseCredits()
{
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
    
        $close.addEventListener('click', () => {
          closeModal($target);
        });
    });
}

function closeModal($el) 
{
    $el.classList.remove('is-active');
}