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

        } else {
            console.log(window.location.href);
        }

    }

    cartMenu();
    // getMenuItemsDetails();

};

orderingSystem();