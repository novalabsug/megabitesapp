const fetchDisplayCart = async() => {


    try {
        const res = await fetch('/cart', {
            method: 'POST',
            body: JSON.stringify({
                email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (err) {
        console.log(err);
    }
}