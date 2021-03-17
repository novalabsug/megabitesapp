const displayMenuTabs = () => {
    const menuTab = document.querySelectorAll('#menu-item');
    const menuTabBtn = document.querySelectorAll('#menu-item-btn');
    menuTab.forEach(tab => {
        if (tab.className === 'burger-menu') {
            tab.classList.add('show');
        }
    });

    for (let i = 0; i < menuTabBtn.length; i++) {
        menuTabBtn[0].classList.add('active');
        // if (menuTabBtn[i].className.toString().split(" ").find(data => data == "active")) {
        //     active.push(menuTabBtn[i].className);
        // }

        const addActive = (array, value) => {

            for (let i = 0; i < array.length; i++) {

                if (array[i].className == value) {
                    array[i].classList.add('active');
                } else {
                    array[i].classList.remove('active');
                }
            }
        }

        menuTabBtn[i].addEventListener('click', () => {
            addActive(menuTabBtn, menuTabBtn[i].className);
            let menu = 'empty';
            let btnClicked = menuTabBtn[i].className.toString().split(" ").splice(0, 1);

            console.log(btnClicked);

            const showMenuTab = (menu) => {
                console.log(menu);
                menuTab.forEach(tab => {
                    if (tab.className === 'burger-menu') {
                        tab.classList.add('show');
                    }
                    if (menu == tab.className) {
                        tab.classList.add('show');
                        console.log(menu);
                    } else if (menu + ' show' !== tab.className) {
                        tab.classList.remove('show');
                    } else {
                        console.log("Active element");
                    }
                });
            }
            switch (btnClicked.toString()) {
                case 'burger-item-btn':
                    menu = 'burger-menu';
                    break;
                case 'pizza-item-btn':
                    menu = 'pizza-menu';
                    break;
                case 'pastries-item-btn':
                    menu = 'pastries-menu';
                    break;
                case 'drinks-item-btn':
                    menu = 'drinks-menu';
                    break;
                case 'rolex-item-btn':
                    menu = 'rolex-menu';
                    break;
                default:
                    break;
            }

            showMenuTab(menu);
        });
    }
}

const showNotificationMenu = (msg) => {
    const notificationPopupMenu = document.querySelector('#notification');
    const notificationMenu = document.querySelector('.notifications');

    const p = document.createElement('p');
    p.innerText = msg + ' ' + 'has been added';

    notificationMenu.appendChild(p);
    notificationPopupMenu.classList.add('show');
    setTimeout(() => {
        notificationMenu.removeChild(p);
        notificationPopupMenu.classList.remove('show');
    }, 3000);
}


const slider = (sliderMenuArray, sliderBtnArray) => {
    let slideCount = 0;
    let btnType = '';

    console.log(slideCount);


    for (let y = 0; y < sliderMenuArray.length; y++) {
        sliderMenuArray[0].classList.add('active');
    }

    for (let i = 0; i < sliderBtnArray.length; i++) {
        sliderBtnArray[i].addEventListener('click', () => {
            btnType = sliderBtnArray[i].className;

            console.log(sliderBtnArray.length);

            console.log(btnType.toString().split(" ").find(data => data == "next-btn"));

            if (btnType.toString().split(" ").find(data => data == "next-btn") == 'next-btn') {
                slideCount += 1;
            } else {
                slideCount -= 1;
            }
            console.log(slideCount);

            if (slideCount == sliderBtnArray.length) {
                slideCount = sliderBtnArray.length - 1;
            } else if (slideCount < 0) {
                slideCount += 1;
            }

            if (slideCount < sliderBtnArray.length) {
                sliderMenuArray[slideCount].classList.add('active');
            } else {
                console.log('Haha');
            }

            if (btnType.toString().split(" ").find(data => data == "next-btn") == 'next-btn') {
                sliderMenuArray[slideCount - 1].classList.remove('active');
            } else {
                sliderMenuArray[slideCount + 1].classList.remove('active');
            }
        });
    }
}

const showMenus = async() => {

    const getMenus = async() => {

        // Menu array to hold menus
        let Menus = [];

        try {
            const res = await fetch('/menu', {
                method: 'POST'
            });

            const data = await res.json();
            console.log(data);
            Menus = data.menuLists;

        } catch (err) {
            console.log(err);
        }

        return Menus;
    }


    // Listen to clicked menu item and check its details in menu array
    const getMenuItemsDetails = async() => {
        const menuItemBtn = document.querySelectorAll('.add-to-cart-btn');
        console.log(menuItemBtn);

        try {
            const Menus = await getMenus();
            let clickedMenuId = "";

            // displaying notification
            const showNotificationMenu = (msg) => {
                const notificationPopupMenu = document.querySelector('#notification');
                const notificationMenu = document.querySelector('.notifications');

                const p = document.createElement('p');

                // check if the there is an element already in the notifications menu
                p.innerText = msg + ' ' + 'has been added';

                console.log(notificationMenu.innerHTML);

                notificationMenu.appendChild(p);
                notificationPopupMenu.classList.add('show');
                setTimeout(() => {
                    notificationMenu.removeChild(p);
                    notificationPopupMenu.classList.remove('show');
                }, 3000);
            }

            // get the index of the clicked menu
            const findId = (array, id) => {
                let idIndex = 0;
                array.forEach((element, index, array) => {
                    console.log(index);
                    if (element.menuId == id) {
                        idIndex = index;
                    }
                });
                return idIndex;
            }

            const cart = async(array, id) => {

                // call the show notification menu function and pass the name of the clicked food item as a parameter
                showNotificationMenu(array[id].menuName);

                // send the id of the menu and email of the user to the database
                try {

                    const menu = array[id];
                    const userEmail = document.querySelector('.menu-icons .user-profile .user-profile-menu .email').innerHTML.trim();
                    const status = 'pending';

                    const res = await fetch('/cart', {
                        method: 'POST',
                        body: JSON.stringify({
                            menu,
                            userEmail,
                            status
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                } catch (error) {
                    console.log(error);
                }

                return console.log(array[id]);
            }

            // Get id of clicked menu
            menuItemBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    console.log(btn.getAttribute('data-target'));
                    let id = btn.getAttribute('data-target');
                    clickedMenuId = findId(Menus, id);
                    cart(Menus, clickedMenuId);
                    console.log(clickedMenuId);
                });
            });

        } catch (error) {
            console.log(error);
        }
    };

    try {
        // Menu array to hold menus
        const Menus = await getMenus();

        const burgerMenuEl = document.querySelector('.burgers .gr');
        const pizzaMenuEl = document.querySelector('.pizzas .gr');

        for (let i = 0; i < Menus.length; i++) {
            if (Menus[i].menuType == "burger") {
                let div = document.createElement('div');
                div.className = "burger";
                div.innerHTML = `
            <div class="burger-img">
                <img src="/images/menus/burgers/2.jpg">
            </div>
            <div class="burger-txt">
                <h4>${Menus[i].menuName}</h4>
                <p>${Menus[i].menuDescription}</p>
            </div>
            <div class="add-to-cart">
                <a class="favorite"><i class="lni lni-heart-filled"></i></a>
                <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
            </div>`;

                burgerMenuEl.appendChild(div);
            } else if (Menus[i].menuType == "pizza") {
                let div = document.createElement('div');
                div.className = "pizza";
                div.innerHTML = `
            <div class="pizza-img">
                <img src="/images/menus/pizza/2.jpg">
            </div>
            <div class="pizza-txt">
                <h4>${Menus[i].menuName}</h4>
                <p>${Menus[i].menuDescription}</p>
            </div>
            <div class="add-to-cart">
                <a class="favorite"><i class="lni lni-heart-filled"></i></a>
                <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
            </div>`;

                pizzaMenuEl.appendChild(div);
            }

        }
    } catch (error) {
        console.log(error);
    }

    getMenuItemsDetails();

}


let sliders = document.querySelectorAll('form #slider-menu');
let sliderBtn = document.querySelectorAll('form #slider-menu #slider-btn');

showMenus();
slider(sliders, sliderBtn);
displayMenuTabs();