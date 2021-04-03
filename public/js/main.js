// Select DOM items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('#mobile-menu');
const menuNav = document.querySelector('.nav-links');
// const menuBranding = document.querySelector('.brand-logo');
const navItems = document.querySelectorAll('.nav-item');

//Set initial state of menu
let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (!showMenu) {
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        // menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        //Set Menu state
        showMenu = true;
    } else {
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        // menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));

        //Set Menu state
        showMenu = false;
    }
}

const displayProfileMenu = () => {
    const menuBtn = document.querySelector('.menu-icons ul .profile .user-profile-btn');
    const menuBtnClose = document.querySelector('.menu-icons .user-profile .user-profile-hdr #close-user-profile');
    const menu = document.querySelector('.menu-icons .user-profile');
    const usernameText = document.querySelector('.menu-icons .user-profile .user-profile-menu .wr p.username');
    const usernameDiv = document.querySelector('.menu-icons .user-profile .user-profile-menu a#username');

    let p = '';
    if (usernameText) {
        p = usernameText.innerHTML.trim();

        console.log(p);
        usernameDiv.innerText = p.slice(0, 1);

        menuBtn.addEventListener('click', () => {
            menu.classList.add('active');
        });

        menuBtnClose.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    }

    const menuMobileBtn = document.querySelector('.menu-icons .mobile .user-profile-btn i');
    const menuMobileBtnClose = document.querySelector('.user-profile.mobile .user-profile-hdr #close-user-profile');
    const menuMobile = document.querySelector('.mobile.user-profile');
    const usernameMobileText = document.querySelector('.user-profile.mobile .user-profile-menu .wr p.username');
    const usernameMobileDiv = document.querySelector('.user-profile.mobile .user-profile-menu a#username');

    let pMobile = '';
    if (usernameMobileText) {
        pMobile = usernameMobileText.innerHTML.trim();

        usernameMobileDiv.innerText = p.slice(0, 1);

        menuMobileBtn.addEventListener('click', () => {
            menuMobile.classList.add('active');
        });

        menuMobileBtnClose.addEventListener('click', () => {
            menuMobile.classList.remove('active');
        });
    }
}

const getComments = async() => {
    const emailEl = document.querySelector('.menu-icons .user-profile .user-profile-menu .email');

    let email = '';
    let CommentsArray = [];

    if (emailEl) {
        email = emailEl.innerHTML.trim();
        try {
            const res = await fetch('/comment', {
                method: 'GET'
            });

            const data = await res.json();

            console.log(data);

            CommentsArray = data.comments;
            console.log(CommentsArray);

        } catch (error) {
            console.log(error);
        }
    }

    return CommentsArray;
}

const displayComments = async() => {
    const commentEl = document.querySelector('.home-testimony .testimony');

    let Comments = await getComments();

    console.log(Comments);

    if (commentEl) {
        if (Comments.length > 0) {
            for (let i = 0; i < Comments.length; i++) {
                let div = document.createElement('div');
                div.className = 'testimony-box';
                div.innerHTML = `
                <p>${Comments[i].comment}</p>
                <h3>~ ${Comments[i].commentName}</h3>
                `;
                commentEl.appendChild(div);
            }
        } else {
            commentEl.parentElement.style.display = "none";
        }
    }
}

const postComments = () => {
    const form = document.querySelector('.home-comment form');
    let commentError = document.querySelector('.home-comment form .input .comment-error');
    let nameError = document.querySelector('.home-comment form .input .name-error');

    console.log(form);

    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        let comment = form.comment.value;
        let name = form.commentName.value;

        commentError.textContent = nameError.textContent = '';

        try {
            const res = await fetch('/comment', {
                method: 'POST',
                body: JSON.stringify({
                    comment,
                    name
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            console.log(data);

            if (data.errors) {
                commentError.textContent = data.errors.comment;
                nameError.textContent = data.errors.commentName;
            }
            if (data.comments) {
                form.commentName.value = ' ';
                form.comment.value = ' ';
            }
        } catch (err) {
            console.log(err);
        }
    })
}

const showWishlist = async() => {
    const emailEl = document.querySelector('.user-profile .user-profile-menu .wr .email');
    const email = emailEl.innerHTML.trim();
    const likesEl = document.querySelectorAll('.menu-icons .favorites a .likes-size');
    console.log(likesEl);

    if (emailEl) {
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

            likesEl.forEach(likes => {
                console.log(likes);
                likes.innerHTML = menuArray.length;
                likes.classList.add('show');
            });
        } catch (err) {
            console.log(err);
        }
    }

}

showWishlist();
displayComments();
postComments();

displayProfileMenu();

// const displayModal = () => {
//     // window.addEventListener('mouseover', (e) => {
//     //     console.log(e);
//     // });
// }

// displayModal();