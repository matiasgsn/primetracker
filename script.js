
async function fetchData(){ // Function to fetch all Warframe data
    // Warframes
    try {
        const response = await fetch("https://api.warframestat.us/warframes//?only=name,isPrime");
    
        if (!response.ok){
            throw new Error("Could not fetch resource");
        }    

        warframes = await response.json();
        warframes = warframes.filter((warframe) => warframe.isPrime === true && !warframe.name.includes("<ARCHWING>"))

        console.log(warframes)
    }

    catch(error){
        console.error(error);
    }

    // Weapons
    try {
        const response = await fetch("https://api.warframestat.us/weapons//?only=name,components,isPrime");
    
        if (!response.ok){
            throw new Error("Could not fetch resource");
        }

        weapons = await response.json();
        weapons.forEach(weapon => {
            if (weapon.components){
                for (let i = 0; i < weapon.components.length; i++){
                    weapon.components[i] = weapon.components[i].name
                } 
            }
        })

        console.log(weapons)

        
    }

    catch(error){
        console.error(error);
    }
}

async function displayData(){
    await new Promise(r => setTimeout(r, 20));
    await fetchData();

    // Warframes
    if (warframes) {
        warframes.forEach(warframe => {
            document.querySelector('#warframes-holder').innerHTML += 
                        `<div class="item" id='${warframe.name}'>
                            <button class="item-tab">${warframe.name}</button>
                            <div class="item-part-holder item-collapsed" id="warframe-part-holder">
                                <div class="item-part" id="warframe-blueprint">
                                    <span class="item-part-name">Blueprint</span>
                                    <select title="${warframe.name}-blueprint" name="item-part-status" class="item-part-status" id="${warframe.name}-blueprint">
                                        <option value="0">Not acquired</option>
                                        <option value="1">Acquired</option>
                                        <option value="2">Built</option>
                                    </select>
                                </div>
                                <div class="item-part" id="warframe-chassis">
                                    <span class="item-part-name" id="warframe-chassis">Chassis</span>
                                    <select title="${warframe.name}-chassis" name="item-part-status" class="item-part-status" id="${warframe.name}-chassis">
                                        <option value="0">Not acquired</option>
                                        <option value="1">Acquired</option>
                                        <option value="2">Built</option>
                                    </select>
                                </div>
                                <div class="item-part" id="warframe-neuroptics">
                                    <span class="item-part-name">Neuroptics</span>
                                    <select title="${warframe.name}-neuroptics" name="item-part-status" class="item-part-status" id="${warframe.name}-neuroptics">
                                        <option value="0">Not acquired</option>
                                        <option value="1">Acquired</option>
                                        <option value="2">Built</option>
                                    </select>
                                </div>
                                <div class="item-part" id="warframe-systems">
                                    <span class="item-part-name">Systems</span>
                                    <select title="${warframe.name}-systems" name="item-part-status" class="item-part-status" id="${warframe.name}-systems">
                                        <option value="0">Not acquired</option>
                                        <option value="1">Acquired</option>
                                        <option value="2">Built</option>
                                    </select>
                                </div>
                            </div>
                        </div>`
            // Item collapsing system
            let items = document.querySelector('#warframes-holder').querySelectorAll('.item');

            items.forEach(item => {
                let itemTab = item.querySelector('.item-tab');
                itemTab.addEventListener("click", collapseItem);

                function collapseItem() {
                    itemTab.nextElementSibling.classList.toggle('item-collapsed')
                    itemTab.classList.toggle('item-tab-collapsed')
                }
            });
        });
    } else {
        console.error('Warframes still empty');
    }


    // document.querySelector('#weapon-part-holder').innerHTML +=
    //                                 `<div class="item-part" id="weapon-${component.name}">
    //                                             <span class="item-part-name">${component.name}</span>
    //                                             <select title="${component.name}" name="item-part-status" class="item-part-status" id="${component.name}">
    //                                                 <option value="0">Not acquired</option>
    //                                                 <option value="1">Acquired</option>
    //                                                 <option value="2">Built</option>
    //                                             </select>
    //                                         </div>`;

    // Weapons
    if (weapons) {
        weapons.forEach(weapon => {
            let weaponHolder = document.querySelector('#weapons-holder')
            let weaponName = weapon.name.replace(/ /g, "-").replace(/&/g, "and").replace(/<ARCHWING>/g, "archwing");
            console.log(weaponHolder)
            weaponHolder.innerHTML += 
                        `<div class="item" id='${weaponName}'>
                            <button class="item-tab">${weapon.name}</button>
                            <div class="item-part-holder item-collapsed ${weaponName}-part" id="weapon-part-holder">
                            </div>
                        </div>`;
            
                        if (weapon.components){
                            for (let i = 0; i < weapon.components.length; i++){
                                console.log(weaponHolder.querySelector(`.${weaponName}-part`))
                                weaponHolder.querySelector(`.${weaponName}-part`).innerHTML +=
                                    `<div class="item-part" id="weapon-${weapon.components[i]}">
                                                <span class="item-part-name">${weapon.components[i]}</span>
                                                <select title="${weapon.components[i]}" name="item-part-status" class="item-part-status" id="${weapon.components[i]}">
                                                    <option value="0">Not acquired</option>
                                                    <option value="1">Acquired</option>
                                                    <option value="2">Built</option>
                                                </select>
                                            </div>`;
                            } 
                        }
            
            // Item collapsing system
            let items = document.querySelector('#weapons-holder').querySelectorAll('.item');

            items.forEach(item => {
                let itemTab = item.querySelector('.item-tab');
                itemTab.addEventListener("click", collapseItem);

                function collapseItem() {
                    itemTab.nextElementSibling.classList.toggle('item-collapsed')
                    itemTab.classList.toggle('item-tab-collapsed')
                }
            });
        });
    } else {
        console.error('Weapons still empty');
    }
}

let filtered = false;

function filterList(){
    let searchValue = document.querySelector('.searchBar').value;
    let items = document.querySelectorAll('.item');
    if (!searchValue) {
        filtered = false;
        items.forEach(item => {
            item.classList.remove('displayOff');
        })
    } else {
        filtered = true;
        items.forEach(item => {
            let itemName = item.id;
            let itemTab = item.querySelector('.item-tab');
            if (!itemName.toLowerCase().includes(searchValue.toLowerCase())) {
                item.classList.add('displayOff');

                itemTab.nextElementSibling.classList.add('item-collapsed')
                itemTab.classList.remove('item-tab-collapsed')
                
            } else {
                item.classList.remove('displayOff');
            }
        }); 
    }
}

let search = document.querySelector('.searchBar');

// Trigger search on Enter
search.addEventListener('keyup', function() {
    filterList()
})

// Dropdown arrow
let itemGroupTab = document.querySelectorAll('.item-group-tab')
itemGroupTab.forEach(groupTab => {
    groupTab.addEventListener("click", collapseGroup);
                function collapseGroup() {
                    let groupTabArrow = groupTab.querySelector('.arrow');
                    groupTab.nextElementSibling.classList.toggle('group-collapsed');
                    groupTabArrow.classList.toggle('down');
                    groupTabArrow.classList.toggle('right');
                }
})

// On startup
displayData()
