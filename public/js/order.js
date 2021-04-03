const orderingSystem = () => {

    // Fetch menu items from back end
    const getMenuItems = async() => {

        // Menu array to hold menus
        let Menus = [];

        try {
            const res = await fetch('/menu', {
                method: 'POST'
            });

            const data = await res.json();
            console.log(data.menuLists);
            Menus = data.menuLists;
            console.log(Menus);
        } catch (err) {
            console.log(err);
        }

        return Menus;
    }

    // fecth cart items
    const cartMenu = async() => {
        const emailEl = document.querySelector('.menu-icons .user-profile .user-profile-menu .email');

        let email = '';

        if (emailEl) {
            email = emailEl.innerHTML.trim();
        }

        const cartSizeEl = document.querySelectorAll('.menu-icons .icon-cart a .cart-size');

        let CartMenu = [];

        try {
            console.log(email);
            const res = await fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({
                    email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            CartMenu = data.cartGet;
            console.log(CartMenu.length);

            cartSizeEl.forEach(cart => {
                cart.innerText = CartMenu.length;
                cart.classList.add('show');
                console.log(cart);
            });

        } catch (error) {
            console.log(error);
        }

        // confirm order
        const href = 'http://localhost:3000/cart';

        const Cart = CartMenu;

        if (window.location.href == href) {
            const cartFullMenu = document.querySelector('.cart-full form .cart-full-menu');
            const cartFull = document.querySelector('.cart-content .cart-full');
            const cartEmpty = document.querySelector('.cart-content .cart-empty');
            const cartMobileMenu = document.querySelector('.mobile-cart .cart-full-menu');

            if (Cart.length > 0) {
                cartFull.classList.add('show');
                cartEmpty.classList.remove('show');
            } else {
                cartFull.classList.remove('show');
                cartEmpty.classList.add('show');
            }

            for (let i = 0; i < Cart.length; i++) {
                var div = document.createElement('div');
                div.className = "order-item";
                div.innerHTML = `
                <div class="order">
                    <div class="order-img">
                        <img src="/images/menus/burgers/2.jpg">
                    </div>
                    <div class="order-txt">
                        <h3>${Cart[i].menu.menuName}</h3>
                        <h4>${Cart[i].menu.menuDescription}</h4>
                    </div>
                </div>
                <div class="order-price">
                    <p>${Cart[i].menu.menuPrice}</p>
                </div>
                <div class="order-quantity">
                    <input type="number" id="quantity" name="order-quantity" value="1">
                </div>
                <div class="order-subtotal">
                    <p data-target="${Cart[i].menu.menuPrice}">UGX ${Cart[i].menu.menuPrice}</p>
                </div>
                `;
                cartFullMenu.appendChild(div);
            }

            const orderQuantity = document.querySelectorAll('.cart-full form .cart-full-menu .order-item .order-quantity input');

            orderQuantity.forEach(quantity => {
                calcTotal();
                quantity.addEventListener('click', () => {
                    const Parent = quantity.parentElement.parentElement;
                    const unitPrice = Parent.querySelector('.order-price p').innerText;
                    const subtotal = Parent.querySelector('.order-subtotal p');
                    subtotal.innerText = `UGX ${unitPrice * quantity.value}`;
                    subtotal.setAttribute('data-target', `${unitPrice * quantity.value}`);
                    calcTotal();
                });
                quantity.addEventListener('input', () => {
                    const Parent = quantity.parentElement.parentElement;
                    const unitPrice = Parent.querySelector('.order-price p').innerText;
                    const subtotal = Parent.querySelector('.order-subtotal p');
                    subtotal.innerText = `UGX ${unitPrice * quantity.value}`;
                    subtotal.setAttribute('data-target', `${unitPrice * quantity.value}`);
                    calcTotal();
                });
            });

            function calcTotal() {
                const totalEl = document.querySelector('.cart-full form .cart-full-footer .cart-total');
                let total = 0;
                const pricesEl = document.querySelectorAll('.cart-full form .cart-full-menu .order-item .order-subtotal p');

                for (let i = 0; i < pricesEl.length; i++) {
                    total += parseInt(pricesEl[i].getAttribute('data-target'))
                }

                totalEl.innerHTML = `<h3>Total</h3><h4>UGX ${total}</h4>`;
            }

            // add items to the mobile menu
            for (let y = 0; y < Cart.length; y++) {
                let div = document.createElement('div');
                div.className = "cart-menu-item";
                div.innerHTML = `
                    <div class="cart-img">
                        <img src="/images/menus/burgers/1.jpg">
                    </div>
                    <div class="cart-txt">
                        <h4>${Cart[y].menu.menuName}</h4>
                        <p>${Cart[y].menu.menuDescription}</p>
                        
                    </div>
                    <div class="remove-from-cart">
                        <input type="number" id="quantity" name="order-quantity" value="1">
                        <a class="price" hidden>${Cart[y].menu.menuPrice}</a>
                        <a class="subprice" data-target="${Cart[y].menu.menuPrice}">UGX ${Cart[y].menu.menuPrice}</a>
                        <a class="delete" data-target='${Cart[y]._id}'><i class="lni lni-trash"></i></a>
                    </div>`;

                cartMobileMenu.appendChild(div);
            }

            const quantityMobileOrder = document.querySelectorAll('form.mobile-cart .cart-full-menu .cart-menu-item .remove-from-cart input');

            quantityMobileOrder.forEach(quantity => {
                calcMobileTotal();
                quantity.addEventListener('click', () => {
                    const Parent = quantity.parentElement;
                    const unitPrice = Parent.querySelector('a.price').innerText;
                    const subtotal = Parent.querySelector('a.subprice');
                    subtotal.innerText = `UGX ${unitPrice * quantity.value}`;
                    subtotal.setAttribute('data-target', `${unitPrice * quantity.value}`);
                    calcMobileTotal();
                });
            });

            function calcMobileTotal() {
                const totalEl = document.querySelector('form.mobile-cart .cart-mobile-footer .cart-mobile-total');
                let total = 0;
                const pricesEl = document.querySelectorAll('form.mobile-cart .cart-full-menu .cart-menu-item .remove-from-cart a.subprice');

                for (let i = 0; i < pricesEl.length; i++) {
                    total += parseInt(pricesEl[i].getAttribute('data-target'))
                }

                totalEl.innerHTML = `<h3>Total: </h3><h4>UGX ${total}</h4>`;
            }

            // Delete menu item and reload window
            const cartDeleteBtns = document.querySelectorAll('.cart-menu-item .remove-from-cart a.delete');

            cartDeleteBtns.forEach(btn => {

                btn.addEventListener('click', async() => {
                    const menuItem = btn.getAttribute('data-target');
                    try {
                        const res = await fetch('/cartDelete', {
                            method: 'POST',
                            body: JSON.stringify({
                                menuItem
                            }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        const data = await res.json();
                        if (data.response) {
                            location.reload();
                        }
                    } catch (error) {
                        console.log(error);
                    }

                });
            })

        } else {
            console.log(window.location.href);
        }

    }

    cartMenu();
    // getMenuItemsDetails();

};

orderingSystem();