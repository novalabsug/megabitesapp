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
                    menu = 'pastry-menu';
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
    p.innerText = msg;

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
            // const showNotificationMenu = (msg) => {
            //     const notificationPopupMenu = document.querySelector('#notification');
            //     const notificationMenu = document.querySelector('.notifications');

            //     const p = document.createElement('p');

            //     // check if the there is an element already in the notifications menu
            //     p.innerText = msg;

            //     console.log(notificationMenu.innerHTML);

            //     notificationMenu.appendChild(p);
            //     notificationPopupMenu.classList.add('show');
            //     setTimeout(() => {
            //         notificationMenu.removeChild(p);
            //         notificationPopupMenu.classList.remove('show');
            //     }, 3000);
            // }

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
                const msg = array[id].menuName + ' ' + 'has been added to cart';
                showNotificationMenu(msg);

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

        const burgerMenuEl = document.querySelector('.burgers-menu-wrapper .gr');
        const pizzaMenuEl = document.querySelector('.pizzas-menu-wrapper .gr');
        const rolexMenuEl = document.querySelector('.rolex-menu-wrapper .gr');
        const pastryMenuEl = document.querySelector('.pastry-menu-wrapper .gr');

        let burgerImageIndex = 1;
        let pizzaImageIndex = 1;
        let pastryImageIndex = 1;
        let rolexImageIndex = 1;
        let drinksImageIndex = 1;

        for (let i = 0; i < Menus.length; i++) {
            switch (Menus[i].menuType) {
                case 'burger':
                    let divBurger = document.createElement('div');
                    divBurger.className = "burger";
                    divBurger.innerHTML = `
                        <div class="burger-img">
                            <img src="/images/menus/burgers/${burgerImageIndex++}.jpg">
                        </div>
                        <div class="burger-txt">
                            <h4>${Menus[i].menuName}</h4>
                            <p>${Menus[i].menuDescription}</p>
                            
                        </div>
                        <div class="add-to-cart">
                            <a class="favorite"><i class="lni lni-heart"></i></a>
                            <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
                            <p>UGX ${Menus[i].menuPrice}</p>
                        </div>`;

                    burgerMenuEl.appendChild(divBurger);
                    break;
                case 'pizza':
                    let divPizza = document.createElement('div');
                    divPizza.className = "pizza";
                    divPizza.innerHTML = `
                        <div class="pizza-img">
                            <img src="/images/menus/pizza/${pizzaImageIndex++}.jpg">
                        </div>
                        <div class="pizza-txt">
                            <h4>${Menus[i].menuName}</h4>
                            <p>${Menus[i].menuDescription}</p>
                            
                        </div>
                        <div class="add-to-cart">
                            <a class="favorite"><i class="lni lni-heart"></i></a>
                            <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
                            <p>UGX ${Menus[i].menuPrice}</p>
                        </div>`;

                    pizzaMenuEl.appendChild(divPizza);
                    break;
                case 'rolex':
                    let divRolex = document.createElement('div');
                    divRolex.className = "rolex";
                    divRolex.innerHTML = `
                    <div class="rolex-img">
                        <img src="/images/menus/rolex/${rolexImageIndex++}.jpg">
                    </div>
                    <div class="rolex-txt">
                        <h4>${Menus[i].menuName}</h4>
                        <p>${Menus[i].menuDescription}</p>
                        
                    </div>
                    <div class="add-to-cart">
                        <a class="favorite"><i class="lni lni-heart"></i></a>
                        <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
                        <p>UGX ${Menus[i].menuPrice}</p>
                    </div>`;
                    rolexMenuEl.appendChild(divRolex);
                    break;
                case 'pastry':
                    let divPastry = document.createElement('div');
                    divPastry.className = "pastry";
                    divPastry.innerHTML = `
                        <div class="pastry-img">
                            <img src="/images/menus/pastry/${pastryImageIndex++}.jpg">
                        </div>
                        <div class="pastry-txt">
                            <h4>${Menus[i].menuName}</h4>
                            <p>${Menus[i].menuDescription}</p>
                           
                        </div>
                        <div class="add-to-cart">
                            <a class="favorite"><i class="lni lni-heart"></i></a>
                            <a class="btn add-to-cart-btn" data-target="${Menus[i].menuId}"><i class="lni lni-cart"></i> add to cart</a>
                            <p>UGX ${Menus[i].menuPrice}</p>
                        </div>`;
                    pastryMenuEl.appendChild(divPastry);
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        console.log(error);
    }

    const addLikes = async() => {

        const likesBtn = document.querySelectorAll('.add-to-cart a.favorite');
        const emailEl = document.querySelector('.user-profile .user-profile-menu .wr .email');
        const likedMenu = document.querySelectorAll('.add-to-cart .add-to-cart-btn');
        const email = emailEl.innerHTML.trim();

        // fetching likes from database and updating them
        try {
            const res = await fetch('/likes', {
                method: 'POST',
                body: JSON.stringify({
                    email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            const menuArray = data.likesGet;
            console.log(data);

            for (let i = 0; i < likedMenu.length; i++) {
                for (let y = 0; y < menuArray.length; y++) {
                    if (menuArray[y].itemId == likedMenu[i].getAttribute('data-target')) {
                        console.log(likedMenu[i]);
                        likedMenu[i].parentElement.querySelector('a.favorite').querySelector('i').className = ("lni lni-heart-filled");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }

        if (likesBtn) {
            likesBtn.forEach(btn => {
                btn.addEventListener('click', async() => {

                    if (btn.querySelector('i').className == "lni lni-heart") {
                        const itemId = btn.parentElement.querySelector('.btn').getAttribute('data-target');

                        try {
                            const res = await fetch('/likes', {
                                method: 'POST',
                                body: JSON.stringify({
                                    userEmail: email,
                                    itemId
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            const data = await res.json();

                            if (data.likesPost) {
                                btn.querySelector('i').className = "lni lni-heart-filled";
                                const msg = data.likesPost.itemId + ' ' + 'has been added to favorites';
                                showNotificationMenu(msg);

                            }
                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        const itemId = btn.parentElement.querySelector('.btn').getAttribute('data-target');
                        const action = 'delete';
                        try {
                            const res = await fetch('/likes', {
                                method: 'POST',
                                body: JSON.stringify({
                                    action,
                                    itemId
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            const data = await res.json();
                            console.log(data.response);

                            if (data.response) {
                                btn.querySelector('i').className = "lni lni-heart";
                                showNotificationMenu(data.response);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }

                });
            });
        }
    }

    getMenuItemsDetails();
    addLikes();

}


let sliders = document.querySelectorAll('form #slider-menu');
let sliderBtn = document.querySelectorAll('form #slider-menu #slider-btn');

showMenus();
slider(sliders, sliderBtn);
displayMenuTabs();
displayMenuTabs();